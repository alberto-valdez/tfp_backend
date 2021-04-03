'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = Schema({
    album: String,
    artista: String,
    idArtista:String,
    fecha: {type: Date, default: Date.now()},
    spotify: String,
    appleMusic: String,
    image: String
})

module.exports = mongoose.model('album', albumSchema);