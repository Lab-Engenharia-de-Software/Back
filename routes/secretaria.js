var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//cadastro de secretaria
route.post('/Cadastro', async (req, res) => {
    console.log('cadastro secretaria')
    try{
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
        
        let validatePesquisador = await prisma.secretarias.findFirst({
            where: {
                email: {
                    equals: req.body.email
                },
            }
        })
        if(validatePesquisador == null){
            validatePesquisador = {id:"1"}
        }
        console.log(validateAdm, validatePesquisador)
        if(validateAdm.id == "1" & validatePesquisador.id =="1" & req.body.authorization == 'admin'){
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
            res.json({"message": `Cadastrado a secretaria ${secretaria.nome}, com id ${secretaria.id}`,
                      "status": "2"})
            
        }else{
            res.json({"message": `Erro: ${req.body.authorization} não possui autorização para esta ação`,
                        "status":"1"})
        }
    }catch(e){
        console.log(e)

    }finally{
        res.json({"message":"Erro de cadastro",
                  "status": "0"})
    }
   
})

//dados de secretaria
route.get("/user/:id", async (req, res) =>{
    try{
        let secretaria = await prisma.secretarias.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        })
        if(secretaria == null){secretaria = {id:"1"}}
        if (secretaria.id != "1"){
            res.json({ 
                email: req.body.email,
                nome: req.body.nome,
                cpf: req.body.cpf,
                telefone: req.body.telefone,
                endereco: req.body.endereco,
                role: "secretaria"})

        }else{
            res.json({"message":"Usuário inválido","status":"0"})
        }

    }catch(e){
        console.log(e)
        console.log("deu ruim em get secretaria", req.body)
        res.json({"message":"internal error","status":"1"})
    }
})

route.get("/Lista", async (req,res) =>{
    try{
        let secretarias = await prisma.secretarias.findMany({
            where:{
                role:"secretaria",
            },
            select:{
                id: true,
                role: true,
                nome: true,
                cpf: true,
                email: true,
                telefone: true,
            }
        })
        res.json(
            {
            "secretarias":secretarias,
        })

    }catch(e){
        console.log(e)
        console.log("deu ruim em get secretaria list", req.body)
        res.json({"message":"internal error","status":"1"})        
    }
})

//atividades de secretaria (por enquanto, em seguida adicionar avaliação de protocolo )
route.get("/Atividades", async (req,res) =>{
    try{
        let perfis = await prisma.pesquisadores.findMany({
            where:{
                role:"invalido",
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
        res.json(
            {
            "message":"Cadastro pendentes de validação",
            "pesquisadores": perfis,
            "status":"2"

        })

    }catch(e){
        console.log(e)
        console.log("deu ruim em get invalidPerf list", req.body)
        res.json({"message":"internal error","status":"1"})        
    }
})


module.exports = route
