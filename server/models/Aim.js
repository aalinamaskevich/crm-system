const {Schema, model} = require('mongoose')
const {ObjectId} = require('bson')

const Aim = new Schema({
    categoryId: {type:ObjectId, required:true},
    name: {type:String, required:true},
    duration: {type:Number, required: true},
    count: {type:Number, required:true},
    date: {type: Date, required: true}
})

const AimModel = model('Aim', Aim);
module.exports = AimModel;