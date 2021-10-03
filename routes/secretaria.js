var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//cadastro de secretaria
route.post('/Cadastro', async (req, res) => {
    console.log('cadastro secretaria')
    
    if (req.headers.authorization === 'admin') {
        let secretaria = await prisma.secretarias.create({
            data: {
                email: req.body.email,
                senha: req.body.senha,
                nome: req.body.nome,
                cpf: req.body.cpf,
                telefone: req.body.telefone,
                endereco: req.body.endereco,
                role: "secretaria"
    
            }
        })
        res.json({"message": `Cadatrado a secretaria ${secretaria.nome}, com id ${secretaria.id}`})
    
    }else{
        res.json({"message": `Erro: ${req.headers.authorization} não possui autorização para esta ação`})
    }
    
})

module.exports = route
