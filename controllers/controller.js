'use strict'
var validator = require('validator');
var posts = require('../models/posts');
var eventos = require('../models/eventos');

var fs = require('fs');
var path = require('path');




var controller = {

    test: (req, res) =>  {
        return res.status(200).send({
            message : 'Test del controler'
        });
    },

    //Guardar post
        savePost: (req, res) => {

        var params = req.body;
        try{
            var validateTitulo = !validator.isEmpty(params.titulo);
            var validateContenido = !validator.isEmpty(params.contenido);
            
        } catch {
            return res.status(200).send({
                status: 'error',
                message: 'Datos invalidos'
            })
        }

        if(validateTitulo && validateContenido){
        
            var postSave = new posts();

            postSave.titulo = params.titulo;
            postSave.contenido = params.contenido;
            postSave.image = null;

            postSave.save((err, postSaved)=>{

                if(err || !postSaved){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Hubo un problema en el servidor'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    postSaved
                });
            });
        } else {
            return res.status(500).send({
                status : 'Error',
                message : 'Hubo un error en el servidor'

            })
        }
    },

        //traer posts
        getPosts : (req, res) => {
            var query = posts.find({});
            var last = req.params.last;

            if(last || last != undefined) {
                query.limit(5);

            }

            query.sort('-_id').exec((err, psts)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'problemas en el servidoer'
                    })
                }

                if(!psts){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se encontraron posts'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                     psts
                });
            })


        },
        //Obtener post 
        getPost : (req, res) =>{
            var postID = req.params.id;
            if(!postID || postID == null) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se encontro id'
                });
            }
            posts.findById(postID, (err, post) =>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion getPost'
                    });
                }

                if(!post){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se encontro el post'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    post
                });
            });

        },

        //Actualizar el post 
        updatePost: (req, res) => {

            var postID = req.params.id;
            var params = req.body;

            try{
            var validateTitulo = !validator.isEmpty(params.titulo);
            var validateContenido = !validator.isEmpty(params.contenido);

            } catch {
                return res.status(500).send({
                    status: 'error',
                    message: 'Datos no validos'
                });
            
            }
            
            if (validateTitulo  && validateContenido){
                posts.findByIdAndUpdate({_id: postID},params, {new:true}, (err, postUpdated) =>{
                    if (err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'error en la peticion'
                        });
                    }

                    if(!postUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'No se pudo realizar el update post'
                        });
                    }

                    return res.status(200).send({
                        status:'success',
                        postUpdated
                    });
                });

            }
            
        },
        //Delete post
        deletePost: (req, res) =>{
            
            var postID = req.params.id;

            

            posts.findOneAndDelete({_id:postID}, (err, postDelated) =>{
                if(err){
                 return   res.status(500).send({
                        status:'error',
                        message: 'Hubo un problema en el servidor delete'
                    });
                }

                if(!postDelated){
                 return    res.status(404).send({
                        status:'error',
                        message: 'Error al eliminar, el post no existe'
                    });
                }

            return res.status(200).send({
                    status:'Success',
                    postDelated
                });
            });

        },

            //Subir imagen 
            uploadImage: (req, res) => {
                var fileName = 'No hay imagen'

                if(!fileName){
                    return res.status(500).send({
                        status: 'error',
                        message: fileName
                    })
                }

               var filePath = req.files.file0.path;
               var fileSplit = filePath.split('/');
               
               fileName = fileSplit[2];
               var fileExtension = fileName.split('\.');
               var extension = fileExtension[1];

               if(extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif'){
                fs.unlink(filePath, (err) =>{
                    return res.status(500).send({
                        status: 'error',
                        message: 'Archivos no validos'
                    })
                });
               } else {
                
                var postID = req.params.id;
                posts.findOneAndUpdate({_id: postID}, {image:fileName}, {new: true}, (err, postUpdated) =>{
                    if(err || !postUpdated) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la petición '
                        });
                    }

                    return res.status(200).send({
                        status: 'Success',
                        postUpdated
                    })
                   


                });

               }
            },
            //Traer imagen 
            getImage: (req, res) => {
               var file = req.params.image;
               var filePath = './multimedia/post/' + file;

               fs.exists(filePath, (exists) =>{
                if(exists){
                    return res.sendFile(path.resolve(filePath));
                } else {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición '
                    });
                }
               });


            },
            //Buscar posts
            searchPost: (req, res) => {
                var searchString = req.params.search;

                posts.find({"$or":[
                    {"titulo":{"$regex": searchString, "$options": "i"}},
                    {"subtitulo":{"$regex": searchString, "$options": "i"}},
                    {"contenido":{"$regex": searchString, "$options": "i"}}
            ]}).sort([['date', 'descending']]).exec((err, psts) =>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición '
                    });
                }
                
                if(!psts || psts.length <= 0){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay post que coincidan con la busqueda '
                    });
                }

                return res.status(200).send({
                    status: 'succes',
                    psts
                });
            })

            

            },
            //create Evento 
            crearEvento:(req, res) =>{
                var params = body.params;
                
                try{
                    var validateTitulo = !validator.isEmpty(params.titulo);
                    var validateDescripcion = !validator.isEmpty(params.descripcion);
                    var validateDia = !validator.isEmpty(params.dia);
                    var validateMes = !validator.isEmpty(params.mes);


                } catch{
                    return res.status(200).send({
                        status:'error',
                        message: 'Datos invalidos'
                    })

                }

                if(validateTitulo && validateDescripcion && validateDia && validateMes){
                    var eventoSave = new eventos();
                    eventoSave.titulo = params.titulo;
                    eventoSave.descripcion = params.descripcion;
                    eventoSave.dia = params.dia;
                    eventoSave.mes = params.mes;

                    eventoSave.save((err, eventoSaved) =>{
                        if(err || !eventoSaved){
                            return res.status(500).send({
                                status:'error',
                                message: 'hubo un problema en el servidor'
                            })
                        }
                        return res.status(200).send({
                            status: 'succes',
                            eventoSaved
                        });
                    });

                } else {
                    return res.status(500).send({
                        status:'error',
                        message:'Hubo un error en el servidor'
                    })
                }
            
            },
            getEventos:(req, eventos)=>{
                var query = eventos.find({});
                var last = req.params.last;

                if(last || last != undefined){
                    query.limit(4);
                }
                
                query.sort('-_id').exec((err, eventosTraidos) =>{
                    if(err ){
                        return res.status(500).send({
                            status: 'error',
                            message: 'hubo un problema en el servidor'  
                        });

                    }
                    if(!eventosTraidos){
                        return res.status(404).send({
                            status: 'error',
                            message:'eventos no encontrados'
                        });
                    }
                    return res.status(200).send({
                        status:'success',
                        eventos: eventosTraidos
                    })
                })
            }

            

}//end controller 

module.exports = controller;