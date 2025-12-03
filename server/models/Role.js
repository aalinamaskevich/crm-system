const {Schema, model} = require('mongoose')

const Role = new Schema({
    name:{type:String, unique:true, required:true}
})

const Roles = model('Role', Role)
module.exports = Roles