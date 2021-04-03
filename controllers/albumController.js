'use strict'

var album = require('../models/album');
var validator = require('validator');

var fs = require('fs');
var path = require('path');



var albumController = {



    saveAlbum: (req, res) => {
        var params = req.body;

        try {
            var validatorAlbum = !validator.isEmpty(params.album);
            var validatorArtista = !validator.isEmpty(params.artista);
            var validatorIdArtista = !validator.isEmpty(params.idArtista);
        } catch {
            return res.status(200).send({
                status: 'error',
                message: 'Datos incompletos'
            });
        }

        if (validatorAlbum && validatorArtista && validatorIdArtista) {

            var disco = new album();

            disco.album = params.album;
            disco.artista = params.artista;
            disco.idArtista = params.idArtista;
            disco.spotify = params.spotify;
            disco.appleMusic = params.appleMusic;
            disco.image = null;

            disco.save((err, albumSaved) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Problemas en el servidor'
                    });
                }

                if (!albumSaved) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No pudo guardarse album'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    albumSaved
                });


            })
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'No se encontraron datos'
            });
        }

    },
    getLastAlbum: (req, res) =>{
        var query = album.find({})
        var last = req.params.last;

        if(last || last != undefined){
            query.limit(1);
        }

        query.sort('-_id').exec((err, lastAlbum) =>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Hubo un problema en el servidor'
                })
            }

            if(!lastAlbum){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontro podcast'
                })
            }

            return res.status(200).send({
                status: 'succes',
               lastAlbum
            })
        })
    },

    getAlbums: (req, res) => {
        var id = req.params.id;
        var query = album.find({ 'idArtista': id });
        

        query.sort('_id').exec((err, albumResult) => {
            if (err || !albumResult) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se encontraron resultados'

                })
            }

            return res.status(200).send({
                status: 'success',
                albumResult

            })
        })
    },


    getAlbum: (req, res) => {
        var id = req.params.id;
       

        album.findById(id, (err, albumResult) => {
            if (err || !albumResult) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se encontraron resultados'

                })
            }

            return res.status(200).send({
                status: 'success',
                albumResult

            })
        })
    },

    editAlbum: (req, res) => {
        var albumId = req.params.id;
        var params = req.body;

        try {
            var validatorAlbum = !validator.isEmpty(params.album);
            var validatorArtista = !validator.isEmpty(params.artista);
            var validatorIdArtista = !validator.isEmpty(params.idArtista);
        } catch {
            return res.status(200).send({
                status: 'error',
                message: 'Datos incompletos'
            });
        }
        if (validatorAlbum && validatorArtista && validatorIdArtista) {
            album.findOneAndUpdate({ _id: albumId }, params, { new: true }, (err, albumUpdated) => {
                if (err) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error en el servidor'
                    });
                }

                if (!albumUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se encontró un archivo para actualizar'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    albumUpdated
                });

            })
        } else {
            return res.status(500).send({
                status: 'error',
                message: 'No se pudo actualizar'
            })
        }
    },

    deleteAlbum: (req, res) => {

        var albumId = req.params.id;

        album.findOneAndDelete({ _id: albumId }, (err, albumDeleted) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error en el servidor'
                })
            }

            if (!albumDeleted) {
                return res.status(200).send({
                    status: 'error',
                    message: 'error al actualizar '
                })
            }

            return res.status(200).send({
                status: 'success',
                albumDeleted
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
            var albumId = req.params.id;

            album.findOneAndUpdate({_id:albumId},{image:fileName}, {new:true}, (err, albumImage) =>{

                if(err){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error en el servidor'
                    })
                }
                if(!albumImage){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Hubo un error al guardar la foto'
                    })
                }

                return res.status(200).send({
                    status: 'error',
                   albumImage
                })


            })
        }

    },

    getImageAlbum: (req, res )=>{
        var file = req.params.image;
        var pathFile = './multimedia/album/' +file;


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

module.exports = albumController;
