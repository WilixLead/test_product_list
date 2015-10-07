/**
 * Created by Aloyan Dmitry on 07.10.2015
 */
var mongoose = require('mongoose');

module.exports = function() {
    var Scheme = new mongoose.Schema({
        title: String,
        description: String,
        photo: String
    });

    if( !mongoose.model('Product') ) {
        return mongoose.model('Product');
    }
    return mongoose.model('User', Scheme);
}
