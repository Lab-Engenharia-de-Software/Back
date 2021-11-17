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
                    status: "invalido",
                    role: "invalido"
    
                }
            })
            res.json({"message": `Cadastrado o pesquisador ${pesquisador.nome}, com id ${pesquisador.id}`,
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
route.get("/user/:id", async (req, res) => {
    console.log(req.params.id + " requested page from " + req.headers.authorization)
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
        if(pesquisador.id != "1"  & pesquisador.status != "invalido" & req.headers.authorization != undefined){ 
            res.json({
                "cargo": pesquisador.role,
                "status": pesquisador.status,
                "nome":pesquisador.nome,
                "cpf": pesquisador.cpf,
                "email": pesquisador.email,
                "telefone": pesquisador.telefone,
                "endereco":pesquisador.endereco,
                "sexo": pesquisador.sexo,
                "area": pesquisador.area,
            })
        
        //apenas adm e secretaria/admin tem acesso a perfis sem cadastro
        }else if(pesquisador.id != "1"  & pesquisador.status == "invalido" 
        & req.headers.authorization != "pesquisador"& req.headers.authorization != "presidente" & req.headers.authorization != undefined){
            res.json({
                "cargo": pesquisador.role,
                "status": pesquisador.status,
                "nome":pesquisador.nome,
                "cpf": pesquisador.cpf,
                "email": pesquisador.email,
                "telefone": pesquisador.telefone,
                "endereco":pesquisador.endereco,
                "sexo": pesquisador.sexo,
                "area": pesquisador.area,
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
//lista de pesquisadores com perfis válidos
route.get("/Lista", async (req,res) =>{
    try{
        let pesquisadores = await prisma.pesquisadores.findMany({
            where:{
                role:"pesquisador",
            },
            select:{
                id: true,
                status: true,
                role: true,
                nome: true,
                cpf: true,
                email: true,
                telefone: true,
                area: true,
                sexo:true
            }
        })

        let presidentes = await prisma.pesquisadores.findMany({
            where:{
                role:"presidente"
            },
            select:{
                id: true,
                status: true,
                role: true,
                nome: true,
                cpf: true,
                email: true,
                telefone: true,
                area: true,
                sexo:true
            }
        })
        if (presidentes.length != 0){
            pesquisadores.unshift(presidentes[0])
        }
        res.json(
            {
            "pesquisadores":pesquisadores,
            "presidentes":  presidentes
        })
        //console.log(pesquisadores)

    }catch(e){
        console.log(e)
        console.log("deu ruim em get pesq list", req.body)
        res.json({"message":"internal error","status":"1"})        
    }
})


//route para alterar informações de pesquisador, por enquanto apenas o cargo e ativar a conta
route.patch("/:id", async (req, res) =>{
    try {
        console.log(req.body)
        console.log(req.headers.sim)
        //atualizar status de pesquisador para parecerista ou inverso
        if (req.headers.authorization == "secretaria" || req.headers.authorization == "admin") {
            if (req.params.id != "1" & req.headers.value == "parecerista" || req.headers.value == "pesquisador") {
                let pesquisador = await prisma.pesquisadores.update({
                    where: {
                        id: parseInt(req.params.id)
                    },
                    data: {
                        "role":"pesquisador",
                        "status": req.headers.value
                    }
                })
                res.json({ "status": "2", "message": `Pesquisador ${pesquisador.nome} designado à ${req.headers.value}.` })
            
            //por enquanto recusar alteração de secretaria para este cargo
            }else if(req.headers.authorization == "secretaria" & req.headers.value == "presidente"){
                res.json({ "message":"Ação inválida, necessário acesso administrativo"})
            
            //atualizar cargo de pesquisador para presidente (apenas adm)
            }else if (req.params.id != "1" & req.headers.value == "presidente") {

                //caso so possa ter 1 presidente
                let exPresidente = await prisma.pesquisadores.updateMany({
                    where: {
                        role:'presidente'
                    },
                    data: {
                        "role": 'pesquisador'
                    }
                })
                let pesquisador = await prisma.pesquisadores.update({
                    where: {
                        id: parseInt(req.params.id)
                    },
                    data: {
                        "role": req.headers.value
                    }
                })
                
                res.json({ "status": "2", "message": `Pesquisador ${pesquisador.nome} designado à Presidente.` })

            }else if (req.params.id != "1" & req.headers.value == "ativar"){
                console.log("patch em ativação do pesquisador")
                let pesquisador = await prisma.pesquisadores.update({
                    where: {
                        id: parseInt(req.params.id)
                    },
                    data:{
                        "role":"pesquisador",
                        "status":"pesquisador"
                    }
                })
                res.json({"status":"2", "message": `Perfil do pesquisador ${pesquisador.nome} ativado`})
            }
        }else{
            res.json({ "message":"Patch Acesso negado","status":"0"})
        }
        
    }catch(e){
        console.log(e)
        console.log("deu ruim em patch pesq", req.body)
        res.json({"message":"internal error","status":"1"})
    }

})

route.delete("/:id", async (req, res) =>{
    let pesquisador = await prisma.pesquisadores.delete({
        where: {
            id:parseInt(req.params.id)
        }
    })
    console.log(pesquisador.id)
    res.json({"message":`Pesquisador cancelado`})

})
//ver id do pesquisador em votos da urna
route.get("/Atividades", async (req, res) =>{
    try{
        //incompleto
        console.log('get atividades pesq')
        let listUrnas = [] //lista de urnas que ele nao votou
        let urnas = await prisma.urnas.findMany({
            where: {
                status:'aberto'
            }
        }) 
        
        let votos = await prisma.votos.groupBy({
            by: ['urnaId'],
            where: {
                eleitorId: parseInt(req.body.eleitor)
                    
            }
        })

        if(votos.length == 0){
            res.json({
                "urnas": urnas
            })
        } else{
            res.json({
                "urnas": listUrnas
            })
        }
        console.log('group',votos)
        console.log(listUrnas)
        

    }catch(e){
        console.log(e)
        console.log("deu ruim em get atividades pesq list", req.body)
        res.json({"message":"internal error","status":"0"})   
    }
})

module.exports = route