'use strict'
var validator = require('validator');
var artista = require('../models/artista');
var fs = require('fs');
var path = require('path');

var artistaController = {


    saveArtista: (req, res) => {

        var params = req.body;

        try{
            var validatorNombre = !validator.isEmpty(params.nombre);
            var validatorDescription = !validator.isEmpty(params.descripcion);
           

        } catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Hubo un problema con los datos',
                err
            })
        }

        if(validatorNombre && validatorDescription){
            var artistaSchema = new artista();
            artistaSchema.nombre = params.nombre;
            artistaSchema.descripcion = params.descripcion 
            artistaSchema.instagram = params.instagram;
            artistaSchema.facebook = params.facebook;
            artistaSchema.spotify = params.spotify;
            artistaSchema.appleMusic = params.appleMusic;
            artistaSchema.soundcloud = params.soundcloud;
            artistaSchema.tipo = params.tipo;
            artistaSchema.image = null;

            artistaSchema.save((err, artistaSaved)=>{
                if(err){
                    return res.status(500).send({
                        status:'error',
                        message: 'error en el servidor'
                    })
                }
                if(!artistaSaved){
                    return res.status(500).send({
                        status:'error',
                        message: 'error al gurdar artista'
                    })
                }

                return res.status(200).send({
                    status:'succes',
                    artistaSaved
                })
            })
        } else {
            return res.status(200).send({
                status:'error',
                message:'Erro en el servidor'
            })
        }
    },

    editArtista:(req, res) =>{

        var artistaId = req.params.id;
        var params = req.body;
        try{
            var validatorNombre = !validator.isEmpty(params.nombre);
            var validatorDescription = !validator.isEmpty(params.descripcion);

        } catch{
            return res.status(500).send({
                status: 'error',
                message: 'No se resivieron datos'
            })
        }
        
        if(validatorNombre && validatorDescription){
            artista.findByIdAndUpdate({_id:artistaId},params,{new:true}, (err, artistaUpdated)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Hubo un error en el servidor'
                    })
                }

                if(!artistaUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Hubo un error en actualizar artista'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                  artistaUpdated
                })
            })
        } else {
            return res.status(500).send({
                status: 'error',
                message: 'No se pudo actualizar'
            })
        }
    },

    getArtistas: (req, res) => {
        var query = artista.find({});


        query.sort('-_id').exec((err, artistaList)=>{
            if(err){
                return res.status(200).send({
                    status: 'error',
                    message: 'hubo un problema en el servidor'
                })
            }
            if(!artistaList){
                return res.status(200).send({
                    status: 'error',
                    message: 'No hay artistas'
                })
            }

            return res.status(200).send({
                status: 'success',
               artistas: artistaList
            })
        })
    },

    getArtista:(req, res) =>{
        var artistaId = req.params.id;
        
        if(!artistaId || artistaId == null){
            return res.status(200).send({
                status: 'error',
                message: 'No hay id'
            })
        }


        artista.findById(artistaId, (err, artist)=>{
            if(err, !artist){
                return res.status(200).send({
                    status: 'error',
                    message: 'No hay artista'
                })
            }

            return res.status(200).send({
                status: 'success',
                artista: artist
            })
        })
    },

    deleteArtist:(req, res)=>{
        var artistaId = req.params.id;

        artista.findOneAndDelete({_id:artistaId}, (err, artistaDeleted) =>{
            if(err){
                return res.status(200).send({
                    status: 'error',
                    message: 'hubo un problema en el servidor'
                })
            }

            if(!artistaId){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontro artista'
                })
            }

            return res.status(200).send({
                status: 'success',
                artistaDeleted
            })
        })

    },

    uploadImage: (req, res) =>{
        var fileName = 'No hay imagen';

        if(!fileName){
            return res.status(200).send({
                status: 'error',
                message: 'No hay archivo'
            })
        }

        var filePath = req.files.file0.path;
        var pathSplit = filePath.split('/');
        fileName = pathSplit[2];
        var extendSplit = fileName.split('\.');
        var fileExtension = extendSplit[1];

        if(fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'jpeg' && fileExtension != 'gif'){

            fs.unlink(filePath, (err) =>{
                return res.status(200).send({
                    status: 'error',
                    message: 'Extension de archivo no aceptado',
                    filePath
                })
            })
            
        } else{
            var artistaId = req.params.id;
            

            artista.findOneAndUpdate({_id:artistaId},{image:fileName}, {new:true}, (err, artistaImage) =>{

                if(err){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error en el servidor'
                    })
                }
                if(!artistaImage){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Hubo un error al guardar la foto'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                   artistaImage
                })


            })
        }

    },
    
    getImage: (req, res )=>{
        var file = req.params.image;
        var pathFile = './multimedia/artista/' +file;

        fs.exists(pathFile, (exists) =>{
            if(exists){
                return res.sendFile(path.resolve(pathFile));
                
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'No hay archivo'
                })
            }
        })

    }

}

module.exports = artistaController;