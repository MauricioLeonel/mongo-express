//realizamos validacion token
const config = require('config')
const token = require('jsonwebtoken')


function validarToken(req,res,next){
	const validacion = req.get('Validation')
	token.verify(validacion, config.get('configToken.SEED'),(err,decoded)=>{
		if(err){
			return res.status(401).json({msj:err})
		}
		req.usuario = decoded.usuario
		next()
		
	})
}

module.exports = validarToken