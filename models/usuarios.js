const mongoose = require('mongoose')
const {Schema} = mongoose

const esquema = new Schema({
	nombre:{type:String,required:true},
	email:{type:String,required:true,unique:true},
	password:{type:String,required:true},
	estado:{type:Boolean,default:true},
	imagen:{type:String,required:false}
})

module.exports = mongoose.model('Usuario',esquema)