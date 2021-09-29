//const { PrismaClient } = require('@prisma/client')
//const prisma = new PrismaClient();
const express = require('express')
const app = express()

var administrador = require('./routes/administrador') //var para uso do endpoint
var login = require('./routes/login') 

app.use(express.json()) //create server

//route endpoints
app.use('/administrador',administrador)
app.use('/login', login)

app.get('/home', async (req, res) => {
  res.json({"message":"test da home"})
  console.log('sim')
})

app.listen(3333,() => {
  console.log('porta 3333 on')
})
console.log('XD')

module.exports = app