const { application } = require('express')
var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//atualizar o estado atual da votação
async function atualizarVotação(urna_id,user_id){ 
    try{
        let urna = await prisma.urnas.findFirst({
            where:{
                id: urna_id,
                status: 'aberto'
            }
        })
        console.log(urna)
        let qntVotosSim = await prisma.votos.count({
            where:{
                voto: 1
            }
        })
        console.log(qntVotosSim)
        let qntVotosNão= await prisma.votos.count({
            where:{
                voto: 0
            }
        })
        console.log(qntVotosNão)


        if (qntVotosSim == urna.minVotos){
            
            //caso so possa ter 1 presidente 
            let exPresidente = await prisma.pesquisadores.updateMany({
                where:{
                    role:'presidente'
                },
                data:{
                    role:'pesquisador'
                }
            })

            //eleger o novo presidente
            let pesquisador = await prisma.pesquisadores.update({
                where: {
                    id: user_id,
                },
                data:{
                    role: 'presidente'
                    //status: 'pesquisador //caso seja parecerista e nao possa ser os 2 cargos
                }
                
            })
            //encerrar votação e eleger o presidente
            return '1' //presidente eleito
        } else if (qntVotosNão == urna.minVotos){
            let closeUrna = await prisma.urnas.update({
                where:{
                    id: urna.id
                },
                data:{
                    status:'fechado'
                }
            })
            //encerrar votação
            return '0' //presidente recusado
        } else{
            return '2' //mantem aberta
        }
        
    }catch (e){
        console.log('erro em atualizar e verificar votação', e)
    }
}


//abrir votação para presidentes
route.post('/Abrir/Presidente', async (req, res) => {
    console.log("votação aberta")
    try{
        let lastPesquisador = await prisma.pesquisadores.findMany({
            where: {
                role:'pesquisador'
            }
        })

        let qntPesquisadores = await prisma.pesquisadores.count({
            where: {
                role:'pesquisador'
              },
        })
        
        console.log(lastPesquisador)
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
                lastId: lastPesquisador[lastPesquisador.length - 1].id
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