const { application } = require('express')
var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()


//abrir votação para presidentes
route.post('/Abrir/Presidente', async (req, res) => {
    console.log("votação aberta")
    try{
        let qntPesquisadores = await prisma.pesquisadores.count({
            where: {
                role:'pesquisador'
              },
        })
        let par_eleitores
        if (qntPesquisadores % 2 == 0){
            par_eleitores = true
        } else{
            par_eleitores = false
        }
        console.log(qntPesquisadores)
        let urna = await prisma.urnas.create({
            data:{
                tipo:'presidente', 
                status:'aberto',
                candidato :{connect: {id: parseInt(req.body.id)}},
                //candidatoId: req.body.id,
                qntVotoSim: par_eleitores ? 1 : 0, //caso seja par, ele terá um voto a mais do adm para evitar empate.
                qntVotoNao: 0,
                minVotosAfavor: Math.floor(parseInt(qntPesquisadores)/2) + 1,
                minVotosContra: Math.floor(parseInt(qntPesquisadores)/2) + 1,
            }
        })
        res.json({"message":`eleições abertas para ${req.body.id}`,"status":"1"})
    }catch(e){
        console.log(e)
        console.log("erro abrir votação body recebido:" + req.body)
        
    }finally{
        res.json({"message":"Ocorreu um erro ao abrir votação",
                "status":"0"})
    }
})
module.exports = route