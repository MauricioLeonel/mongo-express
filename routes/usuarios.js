const express = require('express');
const rutas = express.Router()
const usuario = require('../models/usuarios.js')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const validarToken = require('../middlewares/auth.js')


const schema = Joi.object({
	nombre:Joi.string().min(3).required(),
	// password:Joi.string().pattern()
	email:Joi.string().email({minDomainSegments:2,tlds:{allow:['net','com']}})
})

//realizamos un middleware para poder, concurrir a la peticion



rutas.get('/',validarToken,(req,res)=>{
	//se puede guardar el resultado y hacer el .then y .catch sobre la variable
	usuario.find({estado:true}).select({nombre:1,email:1})
	.then(e=>{
		res.json({users:e})
	}).catch(e=>{
		res.status(400).json({error:e})
	})

})


rutas.get('/:id',validarToken,(req,res)=>{
	const resultado = consultarUsuario(req.params.id);
	resultado.then((e)=>{
		res.json(e)
	})
	.catch(e=>res.status(400).json(e.message))
})

rutas.post('/',(req,res)=>{
	const body = req.body
	// schema.validate({nombre:body.nombre})
	usuario.findOne({email:body.email},(err,user)=>{
		//este error no se da cuando no encuentra usuario,
		//sino cuando el error es propio del servidor esta caido
		if(err){
			return res.status(400).json({error:'server error'})
		}
		//si el usuario existe
		if(user){
			return res.status(400).json({msj:'el usuario ya existe'})
		}else{
			const {error,value} = schema.validate({nombre:body.nombre,email:body.email})
			if(!error){
				let resultado = crearUsuario(body)
				resultado.then(e=>res.json({nombre:e.nombre,email:e.email}))
				.catch(e=>res.status(400).json(e))
			}else{
				res.status(400).json(error.details[0].message)
			}
		}

		
	})

	// const {error,value} = schema.validate({nombre:body.nombre,email:body.email})
	// if(!error){
	// 	let resultado = crearUsuario(body)
	// 	resultado.then(e=>res.json({nombre:e.nombre,email:e.email}))
	// 	.catch(e=>res.status(400).json(e))
	// }else{
	// 	res.status(400).json(error.details[0].message)
	// }

})


rutas.put('/:email',validarToken,(req,res)=>{
	const {email} = req.params
	const {nombre} = req.body
	const {error,value} = schema.validate({nombre:nombre})
	if(!error){
		actualizarDatos2(email,nombre)
		.then((e)=>{
			res.json({nombre:e.nombre,email:e.email})
		})
		.catch((e)=>{
			res.status(400).json(e)
		})
	}else{
		res.status(400).json(error.details[0].message)
	}
	
})

rutas.delete('/:email',validarToken,(req,res)=>{
	desactivarUsuario(req.params.email)
	.then(e=>res.json({nombre:e.nombre,email:e.email,estado:e.estado}))
	.catch(e=>res.status(400).json({error:e}))
})


async function consultarUsuario(id){
	return await usuario.findById(id).select({nombre:1,email:1})
}

// ObjectId("61dccc21db9cbb51bfffd931")
//forma deprecada
/*async function actualizarDatos(id,nombre){
	//esta deprecado
	return await usuario.update({_id:id},{
		$set:{
			nombre:nombre
		}
	})
}


async function actualizarDatos1(id,nombre){
	// const usuarios = await usuario.findById(id)
	const resultado = await consultarUsuario(id)
	resultado.nombre = nombre
	return await resultado.save()
}
*/
async function actualizarDatos2(email,nombre){
	return await usuario.findOneAndUpdate({email},
	{
		$set:{
			nombre: nombre
		}
	},
	{
		new:true
	}
	)
}

async function crearUsuario(body){
	// const salt = bcrypt.genSaltSync(10)
	// const hash = bcrypt.hashSync(body.password,salt);
	const Usuario = new usuario({
		nombre:body.nombre,
		email:body.email,
		password: bcrypt.hashSync(body.password,10)
	})
	return await Usuario.save()
}


async function desactivarUsuario(email){

	return await usuario.findOneAndUpdate({email},
		{
			$set:{
				estado:false
			}
		},
		{
			new:true
		}
	)
}


module.exports = rutas