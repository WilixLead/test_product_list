/**
 * Created by Aloyan Dmitry on 06.10.2015
 */
var mongoose = require('mongoose');
var crypto = require('crypto');

var Scheme = new mongoose.Schema({
    username: String,
    password: String
});

Scheme.index({username: 1});

Scheme.methods.toPublic = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

Scheme.statics.hashPwd = function (pwdStr) {
    return crypto.createHash('md5').update(pwdStr).digest('hex');
}

module.exports = mongoose.model('User', Scheme);