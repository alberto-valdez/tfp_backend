'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var postSchema = Schema({

    titulo: String,
    contenido : String,
    fecha: {type: Date, default: Date.now()},
    image: String

});

module.exports = mongoose.model('post', postSchema);
