//modulos para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

//Ejecucion del express 
var app = express();


//Ficheros de rutas
var routes = require('./routes/routes');
//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Enrutamiento 
app.use('/api', routes);

//Exportacion 
module.exports = app;
