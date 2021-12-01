const { application } = require('express')
var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()

//atualizar o estado atual da votação
async function atualizarVotação(urna_id,user_id){ 
    try{
        let urna = await prisma.urnas.findFirst({
            where:{
                id: parseInt(urna_id),
                status: 'aberto'
            }
        })
        console.log(urna)
        let qntVotosSim = await prisma.votos.count({
            where:{
                urnaId: parseInt(urna_id),
                voto: 1
            }
        })
        console.log(qntVotosSim)
        let qntVotosNão= await prisma.votos.count({
            where:{
                urnaId: parseInt(urna_id),
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
                    id: parseInt(user_id),
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
                    id: parseInt(urna.id)
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
            qntPesquisadores += 1
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
                qntVotoNao: qntPesquisadores, //max votos
                minVotos: Math.floor(parseInt(qntPesquisadores)/2) + 1,
                lastId: lastPesquisador[lastPesquisador.length - 1].id
            }
        })
        
        if (par_eleitores){
            let lastUrna = await prisma.urnas.findMany({})
            console.log(lastUrna.length)
            let XD = await prisma.votos.create({
                data:{
                voto: 1,
                eleitor: {connect:{id: 1}},
                urna: {connect:{id: parseInt(lastUrna[lastUrna.length-1].id)}}
                }
                
            })
        } 
        res.json({"message":`eleições abertas para ${req.body.id}`,"status":"1"})
    }catch(e){
        console.log(e)
        console.log("erro abrir votação body recebido:" + req.body)
        
    }finally{
        res.json({"message":"Ocorreu um erro ao abrir votação",
                "status":"0"})
    }
})

//votar
route.post('/Presidente', async (req, res)=>{
    console.log('voto', req.body)
    try{
        let voto = await prisma.votos.create({
            data:{
                voto: parseInt(req.body.voto),
                eleitor: {connect:{id: parseInt(req.body.eleitor)}},
                urna: {connect:{id: parseInt(req.body.urna)}}
            }
        })
        let a = await atualizarVotação( req.body.urna,req.body.eleitor)
        if (a == '1'){
            res.json({"status":"1", "message":"votação encerrada, presidente eleito!"})
            
        }else if(a == '0'){
            res.json({"status":"1", "message":"votação encerrada, presidente recusado XD!"})
        }else{
            res.json({"message":`voto ${req.body.voto} computado para ${req.body.urna}`,"status":"1"})
        }

    }catch(e){
        console.log(e)
        console.log("erro ao computar voto body recebido:" + req.body)
    }finally{
        res.json({"message":"Ocorreu um erro ao votar",
                "status":"0"})
    }  
})

//lembra do last id
//header.user id
route.get('/Presidente', async(req, res) => {
    try{
        console.log(req.headers.value)
        let urna = await prisma.urnas.findMany({
            where:{
                id: parseInt(req.headers.value),
                status:"aberto"
            }
        })
        urna[0].minVotos
        //contagem de votos
        let qntVotosSim = await prisma.votos.count({
            where:{
                urnaId: parseInt(urna[0].id),
                voto: 1
            }
        })
        console.log(qntVotosSim)
        let qntVotosNão = await prisma.votos.count({
            where:{
                urnaId: parseInt(urna[0].id),
                voto: 0
            }
        })
        let qntVotos = await prisma.votos.count({
            where:{
                urnaId: parseInt(urna[0].id),
            }
        })
        let candidato = await prisma.pesquisadores.findFirst({
            where: {
                id: parseInt(urna[0].candidatoId)
            }
        })
        res.json({
            "Candidato": `${candidato.nome}`,
            "Votos":`${qntVotos} / ${(urna[0].qntVotoNao) }`,
            "Afavor": `${qntVotosSim} / ${urna[0].minVotos }`,
            "Contra": `${qntVotosNão} / ${urna[0].minVotos }`,
            "qntVotos": `${qntVotos}`,
            "qntAfavor": `${qntVotosSim}`,
            "qntContra": `${qntVotosNão}`,
            "minVotos": `${urna[0].minVotos}`
        })
    
    }catch (e) {
        console.log("erro em get votos", e)
    }
})

module.exports = route