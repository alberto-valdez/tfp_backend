'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var podcastSchema  = Schema({
    titulo: String,
    url: String,
    date: {type:Date, default: Date.now}
})

module.exports = moongose.model('podcast', podcastSchema);