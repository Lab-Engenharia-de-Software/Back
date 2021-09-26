var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

route.post('/', async (req, res) => {
    console.log('cadastro adm')

    let adm = await prisma.adm.create({
        data: {
            email: req.body.email,
            senha: req.body.senha,
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone: req.body.telefone,
            endereco: req.body.endereco

        }
    })
    res.json({"message": `Cadatrado o administrador ${adm.nome}, com id ${adm.id}`})
})

module.exports = route