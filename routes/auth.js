const express = require('express');
const rutas = express.Router();
const usuarios = require('../models/usuarios');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config')
// const joi = require('joi');


rutas.post('/',(req,res)=>{
	usuarios.findOne({email:req.body.email})
	.then(e=>{
		if(e){
			let passValido = bcrypt.compareSync(req.body.password, e.password) 
			if(passValido){
				const token = jwt.sign({usuario:{_id:e._id,nombre:e.nombre,email:e.email}}, config.get('configToken.SEED'), {expiresIn: config.get('configToken.expiration')})
				res.json({usuario:{_id:e._id,nombre:e.nombre,email:e.email},token})
			}else{
				res.status(400).json({error:'ok',msj:'usuario o contraseña incorrecta'})
			}
		}else{
			res.status(400).json({error:'ok',msj:'usuario o contraseña incorrecta'})
		}
	})
	.catch(e=>{
		res.status(400).json({error:e,msj:'error en el servicio'})
	})

	// .then(e=>{
	// 	res.json(e)

	// }).catch(e=>{
	// 	res.status(400).send('error')
	// })


})



module.exports= rutas