/**
 * Created by Dmitry on 17.12.2015.
 */
var mongoose = require('mongoose');

var Scheme = new mongoose.Schema({
    user_id: String,
    product_id: String,
    description: String,
    date: Date
});

module.exports = mongoose.model('Review', Scheme);