const {Schema, model} = require('mongoose')
const {ObjectId} = require('bson')

const ProfileInfo = new Schema({
    accountId: {type:ObjectId, required:true, unique:true},
    firstname: {type:String},
    surname: {type:String},
    lastname: {type:String},
    telephone: {type:String}
})

const ProfileInfoModel = model('ProfileInfo', ProfileInfo);
module.exports = ProfileInfoModel;