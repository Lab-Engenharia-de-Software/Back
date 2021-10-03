//Endpoint para login de qualquer usuário cadastrado no sistema

var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

route.post('/', async (req, res) => {
    try{
        console.log("body endiado ",req.body)
        //caso seja adm
        let accessADM = await prisma.adm.findFirst({
            where: {
                email: {
                    equals: req.body.email
                },
                senha: {
                    equals: req.body.senha
                }
            }
        })
        if(accessADM == null){
            accessADM = {id:"1"}
        }
        //caso seja um pesquisador (ainda nao implementado)
        let accessPesquisador = await prisma.pesquisadores.findFirst({
            where: {
                email: {
                    equals: req.body.email
                },
                senha: {
                    equals: req.body.senha
                }
            }
        })
        if(accessPesquisador == null){
            accessPesquisador = {id:"1"}
        }

        let accessSecretaria = await prisma.secretarias.findFirst({
            where: {
                email: {
                    equals: req.body.email
                },
                senha: {
                    equals: req.body.senha
                }
            }
        })
        if(accessSecretaria == null){
            accessSecretaria = {id:"1"}
        }
        //id 1 é pq n tem cadastro
        if ( accessADM.id == "1" 
        & accessPesquisador.id == "1"
        & accessSecretaria.id == "1"){
            res.json({
                "message": "Dados inválidos!",
                "erro": "1"
            })
            
        } else if (accessADM.id != "1"){
            res.json({
                "id":`${accessADM.id}`,
                "nome": `${accessADM.nome}`,
                "email": `${accessADM.email}`,
                "cpf":`${accessADM.cpf}`,
                "cargo":`${accessADM.role}`,
                "status":`${accessADM.status}`
            })
        }  else if (accessPesquisador.id != "1"){
            res.json({
                "id":`${accessPesquisador.id}`,
                "nome": `${accessPesquisador.nome}`,
                "email": `${accessPesquisador.email}`,
                "cpf":`${accessPesquisador.cpf}`,
                "cargo":`${accessPesquisador.role}`,
                "status":`${accessPesquisador.status}`
            })
        } else{
            res.json({
                "id":`${accessSecretaria.id}`,
                "nome": `${accessSecretaria.nome}`,
                "email": `${accessSecretaria.email}`,
                "cpf":`${accessSecretaria.cpf}`,
                "cargo":`${accessSecretaria.role}`
            })
        }
    }catch(e){ 
        console.log(e)
        res.json({
            "message": "erro"
        })
    }   
})

module.exports = route