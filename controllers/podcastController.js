'use strict'
var validator = require('validator');
var fs = require('fs');
var path = require('path');
var pocast = require('../models/podcast');

var podcastController = {


    //Añadir nuevo podcast 
    savePodcast: (req, res)=>{

        var params = req.body;

        try {
            var validatorNombre = !validator.isEmpty(params.titulo);
            var validatorUrl = !validator.isEmpty(params.url);

        } catch {
            return res.status(200).send({
                message: 'datos invalidos',
                status: 'error'
            })
        }

        if(validatorNombre && validatorUrl){
            var podcastSave = new pocast();
            podcastSave.titulo = params.titulo;
            podcastSave.url = params.url;

            podcastSave.save((err, podcastSaved) => {
                
                if(err || !podcastSaved){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Algo salio mal al guardar podcast'
        
                    })
                } else{
                    return res.status(200).send({
                        status: 'success',
                        podcastSaved
                      
                    })
                }
                
         
            })

        } else{
            return res.status(500).send({
                status: 'error',
                message: 'error en el servidor'

            })
        }

    },

    getPodcast: (req, res) =>{
        var query = pocast.find({})
        var last = req.params.last;

        if(last || last != undefined){
            query.limit(1);
        }

        query.sort('-_id').exec((err, pdcast) =>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Hubo un problema en el servidor'
                })
            }

            if(!pdcast){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontro podcast'
                })
            }

            return res.status(200).send({
                status: 'succes',
               pdcast
            })
        })
    },

    getPod: (req, res) =>{

        var id = req.params.id
    
pocast.findById(id, (err, pod)=>{
    if(err || !pod){
        return res.status(200).send({
            status: 'error',
            message: 'No hay podcast'
        })
    }

    return res.status(200).send({
        status: 'success',
        pod
    })
})
    },

    editPodcast: (req, res) =>{
        var podcastId = req.params.id;
        var params = req.body;

        try{
            var validatorTitulo = !validator.isEmpty(params.titulo);
            var validatorUrl = !validator.isEmpty(params.url);

        } catch(err) {
            return res.status(200).send({
                status: 'error',
                message: 'datos invalidos'
            })
        }

        if(validatorTitulo && validatorUrl){
            pocast.findByIdAndUpdate({_id: podcastId}, params, {new:true}, (err, podcast)=>{
                if(err || !podcast){
                    return  res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar'
                    })
                }


                return res.status(200).send({
                    status:'succes',
                    podcast
                })

                
            })
        } else {
            return res.status(200).send({
                status:'error',
                message: 'validacion incorrecta'
            })
        }
    },

    deletePodcast: (req, res) =>{
       var podcastId = req.params.id;

        pocast.findOneAndDelete({_id:podcastId}, (err, podcastDeleted) =>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error al eliminar podcast'
                })
            }

            if(!podcastDeleted){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontro podcast'
                })
            }

            return res.status(200).send({
                status: 'success',
                podcastDeleted
            })
        })
    }
}

module.exports = podcastController;