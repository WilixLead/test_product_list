/**
 * Created by Aloyan Dmitry on 07.10.2015
 */
var mongoose = require('mongoose');
var fs = require('fs');

var Scheme = new mongoose.Schema({
    user_id: String,
    title: String,
    description: String,
    photo: String
});

Scheme.methods.removePhoto = function(){
    if (this.photo && this.photo.length) { //Remove photo before delete product
        if (fs.existsSync(process.cwd() + '/public' + this.photo)) {
            fs.unlinkSync(process.cwd() + '/public' + this.photo);
        }
    }
    this.photo = '';
};

Scheme.methods.uploadPhoto = function (file, user) {
    if (!file || !file.size) {
        return {
            type: 'imageupload',
            success: false,
            message: 'File not specified'
        }
    }
    this.removePhoto(); // Remove old photo if exist

    var ext = '';
    switch (file.mimetype) {
        case 'image/gif':
            ext = '.gif';
            break;
        case 'image/jpeg':
            ext = '.jpg';
            break;
        case 'image/png':
            ext = '.png';
            break;
        default:
            ext = '';
            break;
    }
    if (ext.length) {
        var fileName = Date.now() + ext;
        if (!fs.existsSync(process.cwd() + '/public/images/' + user._id)) {
            fs.mkdirSync(process.cwd() + '/public/images/' + user._id);
        }
        fs.renameSync(file.path, process.cwd() + '/public/images/' + user._id + '/' + fileName);
        this.photo = '/images/' + user._id + '/' + fileName;
        return {}
    } else {
        return {
            type: 'imageupload',
            success: false,
            message: 'File mimetype wrong. Server accept only gif,jpeg,png image types'
        };
    }
};

module.exports = mongoose.model('Product', Scheme);