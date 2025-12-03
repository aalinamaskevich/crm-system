const {Schema, model} = require('mongoose')
const {ObjectId} = require('bson')

const Category = new Schema({
    accountId: {type:ObjectId, required:true},
    name: {type:String, required:true}
})

const CategoryModel = model('Category', Category);
module.exports = CategoryModel;