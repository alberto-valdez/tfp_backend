'use strict'
var user = require('../models/user');
var validator = require('validator');

var userController = {
    saveUser: (req, res)=>{
        var params = req.body;
        try{
            var v_user = !validator.isEmpty(params.user);
            var v_pass = !validator.isEmpty(params.pass);

        }catch(err){
            return res.status(500).send({
                status:'error',
                message: 'Faltan datos'
            })
        }


        if(v_pass && v_user){
            var userToSave = new user();
            userToSave.user = params.user;
            userToSave.pass = params.pass;

            userToSave.save((err, userSaved)=>{

                if(err || !userSaved){
                    return res.status(404).send({
                        status:'error',
                        message:'No pudimos realizar el registro'
                    })
                }

                return res.status(200).send({
                    status:'success',
                    userSaved
                })
            })
        }
    },
    getUser:(req, res)=>{
        var params = req.body;
        user.find({ $and:[{'user': params.user}, {'pass': params.pass}]}).exec((err, userLogin)=>{
            if(err || !userLogin){
                return res.status(500).send({
                    status:'error',
                    message:'error en el servidor'
                })
            }

            if(userLogin.length <= 0 ){
                return res.status(200).send({
                    status:'error',
                    message:'No se encontraron concidencias'
                })
            }

            return res.status(200).send({
                status:'success',
                userLogin
            })
        })

    }
}

module.exports = userController;