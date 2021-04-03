'use strict'
var mongos = require('mongoose');

var Schema = mongos.Schema;


var contacto = Schema({
    nombre: String,
    email: String,
    interes: String,
    comentario: String
})

module.exports = mongos.model('contacto', contacto);