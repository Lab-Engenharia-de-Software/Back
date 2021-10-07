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
            res.json({"message": `Cadatrado a secretaria ${secretaria.nome}, com id ${secretaria.id}`,
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

module.exports = route
