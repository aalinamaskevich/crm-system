const Account = require("../models/Account")
const ProfileInfo = require("../models/ProfileInfo")

exports.readAll = async (req, res) => {
    try {
        var profiles = await ProfileInfo.find();

        const profilesWithAccounts = await Promise.all(profiles.map(async profile => {
            const account = await Account.findOne({ _id: profile.accountId });
            const profileObj = profile.toObject();
            profileObj.account = account;
            return profileObj;
        }));

        res.status(201).json(profilesWithAccounts);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.readById = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }

    try {
        var profile = await ProfileInfo.findOne({ _id: id });
        if (!profile) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }

        const account = await Account.findOne({ _id: profile.accountId });
        const profileWithAccount = profile.toObject();
        profileWithAccount.account = account;

        res.status(201).json(profileWithAccount);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.readByAccountId = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).json({ keyword: "DATA", message: "Недостаточно данных" });
        return;
    }

    try {
        var profile = await ProfileInfo.findOne({ accountId: id });
        if (!profile) {
            res.status(400).json({ keyword: "ACCOUNT_ID", message: "Не существует записи с таким id" });
            return;
        }

        const account = await Account.findOne({ _id: profile.accountId });
        const profileWithAccount = profile.toObject();
        profileWithAccount.account = account;

        res.status(201).json(profileWithAccount);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    const { id, firstname, surname, lastname, telephone } = req.body;
    if (!id) {
        res.status(400).json({ keyword: "ID", message: "Недостаточно данных" });
        return;
    }
    try {
        var profile = await ProfileInfo.findOne({ _id: id });
        if (!profile) {
            res.status(400).json({ keyword: "ID", message: "Не существует записи с таким id" });
            return;
        }
        profile.firstname = firstname;
        profile.surname = surname;
        profile.lastname = lastname;
        profile.telephone = telephone;

        profile = await profile.save();

        profile.account = await Account.findOne({ _id: profile.accountId });

        const account = await Account.findOne({ _id: profile.accountId });
        const profileWithAccount = profile.toObject();
        profileWithAccount.account = account;

        res.status(201).json(profileWithAccount);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}