const Account = require("../models/Account")
const ProfileInfo = require("../models/ProfileInfo")
const Role = require("../models/Role")
const RegistrationKey = require("../models/RegistrationKey")
const argon2 = require("argon2")
const {generateRegistrationKey} = require('../utils/generateRegistrationKey');
const {generateToken} = require('../utils/generateJWT');
const {sendMail} = require('../utils/sendMail');

exports.init = async(req, res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password){
            res.status(400).json({message: "Недостаточно данных для инициализации"});
            return;
        }

        const roles = await Role.find();
        if(!roles || roles.length === 0){
            var adminRole = new Role();
            adminRole.name = "ADMIN";
            adminRole = await adminRole.save();

            var userRole = new Role();
            userRole.name = "USER";
            userRole = await userRole.save();
        }
        else{
            res.status(400).json({message: "Сервер уже инициализирован"});
            return;
        }

        var account = new Account();
        account.username = username;
        account.password = await argon2.hash(password);
        account.role = "ADMIN";
        account.isActive = true;
        
        try{
            account = await account.save();
            res.status(201).json(account);
        } catch (err) {
            console.error(err)
            res.status(400).json({ message: err.message });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.getInit = async(req, res) => {
    try{
        const roles = await Role.find();
        if(!roles || roles.length === 0){
            var adminRole = new Role();
            adminRole.name = "ADMIN";
            adminRole = await adminRole.save();

            var userRole = new Role();
            userRole.name = "USER";
            userRole = await userRole.save();
        }
        else{
            res.status(400).json({message: "Сервер уже инициализирован"});
            return;
        }

        var account = new Account();
        account.username = "admin@admin.com";
        account.password = await argon2.hash("admin");
        account.role = "ADMIN";
        account.isActive = true;
        
        try{
            account = await account.save();
            res.status(201).json(account);
        } catch (err) {
            console.error(err)
            res.status(400).json({ message: err.message });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.login = async(req, res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password){
            res.status(400).json({keyword: "DATA", message: "Недостаточно данных"});
            return;
        }

        const account = await Account.findOne({username: username})
        if(!account){
            res.status(400).json({keyword: "USERNAME", message: "Неверный логин"});
            return;
        }

        const isPasswordCorrect = await argon2.verify(account.password, password)
        if(!isPasswordCorrect){
            res.status(400).json({keyword: "PASSWORD", message: "Неверный пароль"});
            return;
        }

        if(!account.isActive){
            res.status(400).json({keyword: "ACTIVE", message: "Аккаунт заблокирован"});
            return;
        }

        try{
            res.status(201).json({
                id: account._id,
                username: account.username,
                role: account.role,
                token: await generateToken(account)
            });
        }
        catch(err){
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.signup = async(req, res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password){
            res.status(400).json({keyword: "DATA", message: "Недостаточно данных"});
            return;
        }

        const account = await Account.findOne({username: username})
        if(!!account){
            res.status(400).json({keyword: "USERNAME", message: "Аккаунт уже существует"});
            return;
        }

        var registrationKey = await RegistrationKey.findOne({username: username});
        if(!registrationKey)
            registrationKey = new RegistrationKey();

        registrationKey.username = username;
        registrationKey.key = generateRegistrationKey();
        registrationKey.role = "USER";

        await registrationKey.save();

        const title = "Ваш код регистрации";
        const text = "Ваш код регистрации: " + registrationKey.key + "\nНикому не сообщайте и не передавайте данный код во избежание кражи ваших личных данных!";

        sendMail(username, title, text);

        res.status(201).json({message: "Ключ регистрации создан"});
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.checkKey = async(req, res) => {
    try{
        const {username, password, key} = req.body;
        if(!username || !password || !key){
            res.status(400).json({keyword: "DATA", message: "Недостаточно данных"});
            return;
        }

        var account = await Account.findOne({username: username})
        if(!!account){
            res.status(400).json({keyword: "USERNAME", message: "Аккаунт уже существует"});
            return;
        }

        var registrationKey = await RegistrationKey.findOne({username: username, key: key});
        if(!registrationKey){
            res.status(400).json({keyword: "KEY", message: "Неверный ключ регистрации"});
            return;
        }

        account = new Account();
        account.username = username;
        account.password = await argon2.hash(password);
        account.role = registrationKey.role;
        account.isActive = true;

        account = await account.save();

        var profile = new ProfileInfo();
        profile.accountId = account._id;
        await profile.save();

        res.status(201).json({message: "Аккаунт создан"});
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.changePassword = async(req, res) => {
    try{
        const {id, oldPassword, newPassword} = req.body;
        if(!id || !oldPassword || !newPassword){
            res.status(400).json({keyword: "DATA", message: "Недостаточно данных"});
            return;
        }

        if(req.currentAccount._id != id){
            res.status(403).json({keyword: "ID", message: "Недостаточно прав доступа"});
            return;
        }

        var account = await Account.findOne({_id: id})
        if(!account){
            res.status(400).json({keyword: "ID", message: "Аккаунт не существует"});
            return;
        }

        const isPasswordCorrect = await argon2.verify(account.password, oldPassword)
        if(!isPasswordCorrect){
            res.status(400).json({keyword: "PASSWORD", message: "Неверный пароль"});
            return;
        }

        account.password = await argon2.hash(newPassword);

        await account.save();
        res.status(201).json({message: "Аккаунт обновлен"});
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.changeActive = async(req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            res.status(400).json({keyword: "DATA", message: "Недостаточно данных"});
            return;
        }

        var account = await Account.findOne({_id: id})
        if(!account){
            res.status(400).json({keyword: "ID", message: "Аккаунт не существует"});
            return;
        }

        account.isActive = !account.isActive;

        await account.save();
        res.status(201).json({message: "Аккаунт обновлен"});
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}