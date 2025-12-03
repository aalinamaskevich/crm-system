const {Schema, model} = require('mongoose')

const RegistrationKey = new Schema({
    username: {type:String, required:true, unique:true},
    key: {type:String, required:true},
    role:{type:String, required:true, ref:'Role'}
})

const RegistrationKeyModel = model('RegistrationKey', RegistrationKey);
module.exports = RegistrationKeyModel;