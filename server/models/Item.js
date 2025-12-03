const {Schema, model} = require('mongoose')
const {ObjectId} = require('bson')

const Item = new Schema({
    aimId: {type:ObjectId, ref:"Aim"},
    categoryId: {type:ObjectId},
    imagePath: {type:String},
    name: {type:String, required:true},
    description: {type:String},
    date: {type:Date, required: true}
})

const ItemModel = model('Item', Item);
module.exports = ItemModel;