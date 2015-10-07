/**
 * Created by Aloyan Dmitry on 06.10.2015
 */
var mongoose = require('mongoose');

module.exports = function() {
    var Scheme = new mongoose.Schema({
        title: String,
        password: String
    });

    if( !mongoose.model('User') ) {
        return mongoose.model('User');
    }
    return mongoose.model('User', Scheme);
}