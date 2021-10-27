var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//cadastrar um novo bioterio
route.post('/Cadastro', async (req, res) => {
    console.log('cadastro de bioterio')
    try {
        
        }

    catch(e){

        console.log(e)
        console.log("body recebido:" + req.body)
    } finally{
        res.json({"message":"Ocorreu um erro",
                "status":"0"})
    }
    
})
module.exports = route