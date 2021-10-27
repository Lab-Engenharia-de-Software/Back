var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//cadastrar um novo bioterio
route.post('/Cadastro', async (req, res) => {
    console.log('cadastro de bioterio')
    try {
        let bioterio = await prisma.bioterios.create({
            data: {
                nome: req.body.nome,
            },
        })
        res.json({"message":"biotério cadastrado",
                "status":"success"})
        }

    catch(e){
        console.log(e)
        console.log("body recebido:" + req.body)
    } finally{
        res.json({"message":"Ocorreu um erro em cadastro de bioterio",
                "status":"0"})
    }
})

route.post('/Especie/:bioterio_id', async (req, res) => {
    try {
        let especie_bioterio = await prisma.especies.create({
            data:{
                bioterio:{connect: {id: parseInt(req.params.bioterio_id)}},
                nome: req.body.nome,
                quantidade: parseInt(req.body.quantidade)
            }
        })
        res.json({"message":"especie cadastrada",
                "status":"success"})
        
        }

    catch(e){
        console.log(e)
        console.log("body recebido:" + req.body)
    } finally{
        res.json({"message":"Ocorreu um erro em cadastro de especie",
                "bioterio": req.params.bioterio_id, 
                "status":"0"})
    }

    });
  
module.exports = route