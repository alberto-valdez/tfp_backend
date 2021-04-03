'use strict'

var mongoos = require('mongoose');
var Schema = mongoos.Schema;

var eventosSchema = Schema({
        titulo: String,
        descripcion: String,
        dia: String,
        mes: String
    })

module.exports = mongoos.model('eventos', eventosSchema);