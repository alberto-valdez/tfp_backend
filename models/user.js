'use strict'
var moongose = require('mongoose');
var Schema = moongose.Schema;

var user = Schema({
    user: String,
    pass: String
})


module.exports = moongose.model('user', user);
