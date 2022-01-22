const mongoose = require('mongoose');
const {Schema, model} = mongoose
//metodo normalizado - por referencia
// const Autor = mongoose.Schema;


//metodo por documentos embebidos
const Autor2 = Schema({
	nombre:String,
	email:String
})


const cursoSchema = Schema({
	titulo:{type:String,required:true},
	//metodo normalizado - por referencia
	// autor:{type:Autor.Types.ObjectId, ref: 'Usuario'},
	//metodo por documentos
	autor:Autor2,
	descripcion:{type:String,required:true},
	estado:{type:Boolean,default:true},
	imagen:{type:String,required:false},
	alumnos:{type:Number,default:0},
	califica:{type:Number,default:0}
})

module.exports = model('Curso',cursoSchema)