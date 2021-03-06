//const { PrismaClient } = require('@prisma/client')
//const prisma = new PrismaClient();
const express = require('express');
const app = express();
const cors = require('cors')

var administrador = require('./routes/administrador'); //var para uso do endpoint
var pesquisador = require('./routes/pesquisador')
var secretaria = require('./routes/secretaria')
var login = require('./routes/login');
var bioterio = require('./routes/bioterio');
var voto = require('./routes/vote');
const port = process.env.PORT || 3333;

app.use(express.json()); //create server
app.use(cors())

//route endpoints
app.use('/administrador',administrador);
app.use('/login', login);
app.use('/Pesquisador', pesquisador)
app.use('/Secretaria', secretaria);
app.use('/Bioterio', bioterio)
app.use('/voto/', voto)

app.get('/home', async (req, res) => {
  res.json({"message":"test da home com heroku "})
  console.log('sim'); 
})

app.listen(port,() => {
  console.log('porta on',port);
})

module.exports = app;