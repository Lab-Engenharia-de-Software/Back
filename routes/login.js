//Endpoint para login de qualquer usuário cadastrado no sistema

var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

route.post('/', async (req, res) => {
    try{
        console.log("body endiado ",req.body)
        //caso seja adm
        let accessPesquisador = null
        let accessSecretaria = null 
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

        //caso seja um pesquisador (ainda nao implementado)
        {/*if (accessADM == null){
            let accessPesquisador = await prisma.Pesquisador.findFirst({
                where: {
                    email: {
                        equals: req.body.email
                    },
                    senha: {
                        equals: req.body.email
                    }
                }
            })
        } */}
        console.log(accessADM)

        if ( accessADM == null || accessADM.id == "1"){
            res.json({
                "message": "Dados inválidos!",
                "erro": "1"
            })
            
        } else{
            res.json({
                "matricula":`${accessADM.id}`,
                "nome": `${accessADM.nome}`,
                "email": `${accessADM.email}`,
                "cpf":`${accessADM.cpf}`,
                "cargo":`${accessADM.role}`,
                "status":`${accessADM.status}`
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