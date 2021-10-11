const { PrismaClientValidationError } = require('@prisma/client/runtime')
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
//pegar informações de um pesquisador
route.get("/:id", async (req, res) => {
    try{
        let pesquisador = await prisma.pesquisadores.findFirst({ 
            where: {
                id: parseInt(req.params.id)
            }
        })
        if(pesquisador == null){
            pesquisador = {id:"1"}
        }
        //sem login nao vê usuario e pesquisadores não veem perfil nao cadastrado
        if(pesquisador.id != "1"  & pesquisador.status != "invalido" & req.body.authorization != undefined){ 
            res.json({
                "cargo": pesquisador.cargo,
                "status": pesquisador.status,
                "nome":pesquisador.nome,
                "cpf": pesquisador.cpf,
                "email": pesquisador.email,
                "telefone": pesquisador.telefone,
                "endereco":pesquisador.endereco,
                "sexo": pesquisador.sexo,
                "area": pesquisador.area,
                "message":"success"
            })
        
        //apenas adm e secretaria/admin tem acesso a perfis sem cadastro
        }else if(pesquisador.id != "1"  & pesquisador.status == "invalido" 
        & req.body.authorization != "pesquisador"& req.body.authorization != "presidente" & req.body.authorization != undefined){
            res.json({
                "cargo": pesquisador.cargo,
                "status": pesquisador.status,
                "nome":pesquisador.nome,
                "cpf": pesquisador.cpf,
                "email": pesquisador.email,
                "telefone": pesquisador.telefone,
                "endereco":pesquisador.endereco,
                "sexo": pesquisador.sexo,
                "area": pesquisador.area,
                "message":"success"
            })
        }
        else{
            res.json({"message":"Usuário ou acesso inválido",
                      "status":"0",
                    "id":req.params.id})
        }
    }catch(e){
        console.log(e)
        console.log("deu ruim em get pesq", req.body)
        res.json({"message":"internal error","status":"1"})
    }
})

//route para alterar informações de pesquisador, por enquanto apenas o cargo e ativar a conta
route.patch("/:id", async (req, res) =>{
    try {
        //atualizar status de pesquisador para parecerista ou inverso
        if (req.body.authorization == "secretaria" || req.body.authorization == "admin") {
            if (req.params.id != "1" & req.body.value == "parecerista" ||  req.body.value == "pesquisador") {
                let pesquisador = await prisma.pesquisadores.update({
                    where: {
                        id: parseInt(req.params.id)
                    },
                    data: {
                        "status": req.body.value
                    }
                })
                res.json({ "status": "2", "message": `Pesquisador ${pesquisador.nome} designado à ${req.body.value}.` })
            
            //por enquanto recusar alteração de secretaria para este cargo
            }else if(req.body.authorization == "secretaria" & req.body.value == "presidente"){
                res.json({ "message":"Ação inválida, necessário acesso administrativo"})
            
            //atualizar cargo de pesquisador para presidente
            }else if (req.params.id != "1" & req.body.value == "presidente" & req.authorization == "administrador") {
                let pesquisador = await prisma.pesquisadores.update({
                    where: {
                        id: parseInt(req.params.id)
                    },
                    data: {
                        "cargo": req.body.value
                    }
                })
                res.json({ "status": "2", "message": `Pesquisador ${pesquisador.nome} designado à Presidente.` })
            }
        }else{
            res.json({ "message":"acesso negado"})
        }
        
    }catch(e){
        console.log(e)
        console.log("deu ruim em patch pesq", req.body)
        res.json({"message":"internal error","status":"1"})
    }

})
module.exports = route