'use strict'
var moongose = require('mongoose');
var Schema = moongose.Schema;

var artista = Schema({
    nombre: String,
    descripcion: String,
    instagram: String,
    facebook: String,
    spotify: String,
    appleMusic: String,
    soundcloud: String,
    tipo: String,
    image: String
})

module.exports = moongose.model('artista', artista);