const {Schema, model} = require('mongoose')

const Account = new Schema({
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    role:{type:String, required:true, ref:'Role'},
    isActive: {type:Boolean, required:true}
})

const AccountModel = model('Account', Account);
module.exports = AccountModel;