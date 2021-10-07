var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//cadastro de pesquisador
route.post('/Cadastro', async (req, res) => {
    try {
        //validar se ja existe email igual cadastrado
        let validateAdm = await prisma.adm.findFirst({
            where: {
                email: {
                    equals: req.body.email
                },
            }
        })
        if(validateAdm == null){
            validateAdm = {id:"1"}
        }
        
        let validateSecretaria = await prisma.secretarias.findFirst({
            where: {
                email: {
                    equals: req.body.email
                },
            }
        })
        if(validateSecretaria == null){
            validateSecretaria = {id:"1"}
        }
        console.log(validateAdm, validateSecretaria)
        if(validateAdm.id == "1" & validateSecretaria.id =="1"){
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
            res.json({"message": `Cadatrado o pesquisador ${pesquisador.nome}, com id ${pesquisador.id}`,
                      "status": "2"})

        }else{
            res.json({"message":"Email já cadastrado!",
                    "status": "1"})
        }

    }catch(e){
        console.log(e)
        console.log("body recebido:" + req.body)
    } finally{
        res.json({"message":"Ocorreu um erro",
                "status":"0"})
    }
    
})

module.exports = route