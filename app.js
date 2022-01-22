const express = require('express');
const app = express();
const usuarios = require('./routes/usuarios.js')
const mongoose = require('mongoose');
const cursos = require('./routes/cursos.js')
const auth = require('./routes/auth.js')
const config = require('config')


// config.NODE_ENV='development'

//implementamos db
mongoose.connect(config.get('configDB.HOST'),{useNewUrlParser:true})
.then(()=>console.log('se conecto a la base'))
.catch(e=>console.log('no se pudo conectar a la base',e))
// mongoose.set('useCreateIndex',true)


app.use(express.json())
app.use(express.urlencoded());

app.use('/api/usuarios',usuarios);
app.use('/api/cursos',cursos);

app.use('/api/auth',auth)


//definimos el puerto
const port = process.env.PORT || 4000

app.listen(port,()=>{
	console.log('escuchando...')
})

