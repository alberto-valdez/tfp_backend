'use strict'

var validator = require('validator');
var contacto = require('../models/contacto');


var contactoController = {
    
    
    createContacto:(req, res)=>{
        var params = req.body;

        try{
            var v_nombre = !validator.isEmpty(params.nombre)
            var v_email = !validator.isEmpty(params.email)
           
        

        } catch(err){
            return res.status(500).send({
                message: 'Faltan datos',
                status:'Error',
                err
            })
        }

        
        if(v_nombre && v_email){
            var cont = new contacto()
            cont.nombre = params.nombre;
            cont.email = params.email;
            cont.interes = params.interes;
            cont.comentario = params.comentario;

            cont.save((err, contactoSaved)=>{
                if(err || !contactoSaved){
                    return res.status(500).send({
                        message:'Error al guardar',
                        status:'error'
                       })
                }

                return res.status(200).send({
                    status:'success',
                    contactoSaved
                })
            })

        } else{
            return res.status(200).send({
                message:'error en el servidor',
                status:'error'
            }) 
        }
    },

    getContactos:(req, res)=>{
        var query = contacto.find({});

        query.sort('-_id').exec((err,listaR)=>{
            if(err || !listaR){
                return res.status(500).send({
                    message:'No se encontraron datos',
                    status:'error',
                    err
                })
            }

            return res.status(200).send({
                status:'success',
                lista: listaR
            })
        })
    },

    deleteContacto:(req, res)=>{
        var id =  req.params.id;
        contacto.findOneAndDelete({_id:id}, (err, deleted)=>{
            if(err, !deleted){
                return res.status(500).send({
                    status:'error',
                    message:'No se encontro elemento a eliminar'
                })
            }
            
            return res.status(200).send({
                status:'success',
                deleted
            })
        })
    }

}

module.exports = contactoController;