/**
 * Created by Aloyan Dmitry on 07.10.2015
 */
var express = require('express');
var multer = require('multer');
var fs = require('fs');
var Product = require('./../models/product.js');

var router = express.Router();
var upload = multer({dest: './../uploads'});

module.exports = function (app, auth, io) {
    /* Get list of products */
    router.get('/', auth, function (req, res) {
        Product.count({user_id: req.user._id}, function(err, count){
            if (err) {
                return res.send({
                    success: false,
                    err: err
                });
            }
            if( !count ){
                return res.send({
                    success: true,
                    data: [],
                    count: 0
                });
            }
            Product.find({user_id: req.user._id}, function(err, products){
                if (err) {
                    return res.send({
                        success: false,
                        err: err
                    });
                }
                return res.send({
                    success: true,
                    data: products,
                    count: count
                });
            });
        });
    });

    /* Get product info */
    router.get('/:id', auth, function (req, res) {
        Product.findOne({_id: req.params.id, user_id: req.user._id}, function (err, doc) {
            if (err) {
                return res.send({
                    success: false,
                    err: err
                });
            }
            if (!doc) {
                return res.send({
                    success: false,
                    message: 'Products not found'
                });
            }
            return res.send({
                success: true,
                data: doc
            });
        });
    });

    /* Create new product */
    router.post('/', auth, upload.single('file'), function (req, res) {
        if (!req.body.title || !req.body.title.length) {
            return res.send({
                success: false,
                message: 'Title required'
            });
        }

        var product = new Product({
            user_id: req.user._id,
            title: req.body.title,
            description: req.body.description,
            photo: ''
        });
        var photoStatus = product.uploadPhoto(req.file, req.user);

        product.save(function (err) {
            if (err) {
                return res.send({
                    success: false,
                    err: [err, photoStatus]
                });
            }
            
            // Notice UI about updates
            io.sockets.sockets.forEach(function(socket){
                if( socket.decoded_token && socket.decoded_token._id && 
                    socket.decoded_token._id == req.user._id ) {
                    socket.emit('created', product);
                }
            });
            
            return res.send({
                success: true,
                err: [photoStatus],
                data: product
            })
        })
    });

    /* Update existing product */
    router.put('/:id', auth, upload.single('file'), function (req, res) {
        if (!req.params.id) {
            return res.send({
                success: false,
                message: 'Product ID not specified'
            });
        }

        if (!req.body.title || !req.body.title.length) {
            return res.send({
                success: false,
                message: 'Title required'
            });
        }
        
        Product.findOne({_id: req.params.id, user_id: req.user._id}, function (err, product) {
            if (err) {
                return res.send({
                    success: false,
                    err: [err]
                });
            }
            if (!product) {
                return res.send({
                    success: false,
                    message: 'Product not found'
                });
            }

            var photoStatus = product.uploadPhoto(req.file, req.user);
            
            product.user_id = req.user._id;
            product.title = req.body.title;
            product.description = req.body.description;
            
            product.save(function (err) {
                if (err) {
                    return res.send({
                        success: false,
                        err: [err, photoStatus]
                    });
                }
                
                // Notice UI about updates
                io.sockets.sockets.forEach(function(socket){
                    if( socket.decoded_token && socket.decoded_token._id &&
                        socket.decoded_token._id == req.user._id ) {
                        socket.emit('updated', product);
                    }
                });
                
                return res.send({
                    success: true,
                    err: [photoStatus],
                    data: product
                });
            });
        });
    });

    /* Delete existing product */
    router.delete('/:id', auth, function (req, res) {
        if (!req.params.id) {
            return res.send({
                success: false,
                message: 'Product ID not specified'
            });
        }
        Product.findOne({_id: req.params.id, user_id: req.user._id}, function (err, doc) {
            if (err) {
                return res.send({
                    success: false,
                    err: err
                });
            }
            if (!doc) {
                return res.send({
                    success: false,
                    message: 'Product not found'
                });
            }
            doc.removePhoto();
            doc.remove(function (err) {
                if (err) {
                    return res.send({
                        success: false,
                        err: err
                    });
                }

                // Notice UI about updates
                io.sockets.sockets.forEach(function(socket){
                    if( socket.decoded_token && socket.decoded_token._id &&
                        socket.decoded_token._id == req.user._id ) {
                        socket.emit('removed', req.params.id);
                    }
                });
                
                return res.send({
                    success: true
                });
            });
        });
    });

    return router;
};