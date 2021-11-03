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
                status: req.body.status,
                qntEspecies: 0
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
                quantidade: 1
            }
        })

        //atualizar qnt de especies no bioterio
        let qntEspecies = await prisma.bioterios.findFirst({
            where: {
                id: parseInt(req.params.bioterio_id)
            },
            select:{
                qntEspecies: true,
            }
        })
        let bioterio = await prisma.bioterios.update({
            where: {
                id: parseInt(req.params.bioterio_id)
            },
            data: {
                "qntEspecies": qntEspecies.qntEspecies + 1
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
    
    route.get('/Lista', async (req, res) => {
        try {
            let bioterios = await prisma.bioterios.findMany()
            res.json({
                "status": "success",
                "bioterios":bioterios
            })
    
        }
        catch(e){
            console.log(e)
        } finally{
            res.json({"message":"Ocorreu um erro em get de bioterio", 
                    "status":"0"})
        }
    })

route.get('/:bioterio_id', async (req, res) => {
    try {
        
        let bioterio = await prisma.bioterios.findFirst({ 
            where: {
                id: parseInt(req.params.bioterio_id)
            }
        })
        let especies = await prisma.especies.findMany({ 
            where: {
                bioterioId: parseInt(req.params.bioterio_id)
            },
        })

        if(bioterio == null){
            bioterio = {id:"1"}
        }
        if (bioterio.id != "1"){
            res.json({
                "status": "success",
                "nome": bioterio.nome,
                 "especies" : especies})
        }
        
        }

    catch(e){
        console.log(e)
    } finally{
        res.json({"message":"Ocorreu um erro em get de bioterio",
                "bioterio": req.params.bioterio_id, 
                "status":"0"})
    }

})

//deletar bioterio
route.delete('/:bioterio_id', async (req, res) => {
    try {
        let especie_bioterio = await prisma.especies.deleteMany({
            where: {
                bioterioId: parseInt(req.params.bioterio_id)
              },
        })

        let bioterio = await prisma.bioterios.delete({
            where: {
                id: parseInt(req.params.bioterio_id)
              },
        })
        res.json({"message":"bioterio deletado",
                    "status":"1" })

    
    }catch(e){
        console.log(e)
    } finally{
        res.json({"message":"Ocorreu um erro em delet de bioterio",
                "bioterio": req.params.bioterio_id, 
                "status":"0"})
    }

})

module.exports = route