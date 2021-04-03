'use strict'

var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

var app = require('./app');
var port = 3333;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/todosFlotan', {useNewUrlParser: true})
        .then(()=>{
            console.log('## conexion a la base de datos realizada ##');
            app.listen(port, ()=>{
                console.log('## Servidor Escuchando en el puerto '+port+' ##');
            });
        })