var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//cadastro de pesquisador
route.post('/Cadastro', async (req, res) => {
    console.log('cadastro  adm')

    let pesquisador = await prisma.pesquisadores.create({
        data: {
            email: req.body.email,
            senha: req.body.senha,
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone: req.body.telefone,
            endereco: req.body.endereco,
            sexo: req.body.sexo,
            nascimento: req.body.nascimento,
            area: req.body.area,
            status: "pesquisador", //isso pode ser alterado para parecerista ou presidente (futuramente)
            role: "pesquisador"

        }
    })
    res.json({"message": `Cadatrado o pesquisador ${pesquisador.nome}, com id ${pesquisador.id}`})
})