//Endpoint para login de qualquer usuário cadastrado no sistema

var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

route.post('/', async (req, res) => {
    try{
        //caso seja adm
        let accessPesquisador = null
        let accessSecretaria = null 
        let accessADM = await prisma.adm.findFirst({
            where: {
                email: {
                    equals: req.body.email
                },
                senha: {
                    equals: req.body.email
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

        res.json({
            "message": `login ${accessADM.email}, ${accessADM.status}`
        })
        if(!accessADM) return res.json({ "error": "deu ruim"})

    }catch(e){

    }
    
})

module.exports = route