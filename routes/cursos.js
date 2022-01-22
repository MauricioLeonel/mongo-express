const express = require('express')
const rutas = express.Router();
const cursos = require('../models/cursos.js')
const Joi = require('joi')
const validarToken = require('../middlewares/auth.js')

const schema = Joi.object({
	titulo:Joi.string().min(3).required(),
	descripcion:Joi.string().min(3).required(),
	alumnos:Joi.number().integer().required(),
	califica:Joi.number().integer().required(),
})



rutas.get('/',validarToken,(req,res)=>{
	// res.json({
	// 	usuario:req.usuario
	// })
	const result = cursos.find({estado:true})
					//normalizado - por referencia, 
					//usamos la funcion para que busque el autor en base al id que tengo
					//y me traigo nombre, email y quito el id, sino me trae todos los datos
					//y hay datos sensibles 
				   // .populate('autor','nombre email -_id')
	result.then(e=>res.json(e))
	.catch(e=>res.status(400).json(e))
})

rutas.post('/',validarToken,(req,res)=>{
	const {titulo,descripcion,alumnos,califica} = req.body

	const {error,value}= schema.validate({titulo,descripcion,alumnos,califica})
	if(!error){
	
		guardarCurso(titulo,descripcion,alumnos,califica,req.usuario)
		.then(e=>res.json(e))
		.catch(e=>res.status(400).json(e))
	}else{
		res.status(400).json(error.details[0].message)
	}
})

rutas.put('/:id', validarToken,(req,res)=>{
	const {titulo,descripcion} = req.body
	actualizarCurso(req.params.id,titulo,descripcion)
	.then(e=>res.json({message:'los datos se actualizaron correctamente',e}))
	.catch(e=>res.status(400).json(e))
})


rutas.delete('/:id',validarToken,(req,res)=>{
	const {id}=req.params
	borrarUsuario(id)
	.then(e=>res.json({message:'se borro el curso',del:e}))
	.catch(e=>res.status(400).json(e))
})


async function borrarUsuario(id){
	return await cursos.findByIdAndUpdate({_id:id},{
		$set:{
			estado:false
		}
	},
	{new:true})

}


async function actualizarCurso(id,titulo,descripcion){
	return await cursos.findByIdAndUpdate({_id:id},
	{
		$set:{
			titulo,
			descripcion
		}
	},
	{new:true})
}


async function guardarCurso(titulo,descripcion,alumnos,califica,usuario){
	console.log(usuario)
	const curso = new cursos({
		titulo,
		//normalizado - por referencia - guardamos solo el ID 
		// autor:usuario.id,
		//no normalizado - por documento
		autor:usuario,
		descripcion,
		alumnos,
		califica
	})

	return await curso.save()
}


module.exports=rutas
