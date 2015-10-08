/**
 * Created by Aloyan Dmitry on 07.10.2015
 */
var express = require('express');
var router = express.Router();

module.exports = function(app, auth){
    /* Get list of products */
    router.get('/', auth, function (req, res) {
        res.send('This is not implemented now');
    });

    /* Get product info */
    router.get('/:id', auth, function (req, res) {
        res.send('This is not implemented now');
    });

    /* Create new product */
    router.post('/', auth, function (req, res) {
        res.send('This is not implemented now');
    });

    /* Update existing product */
    router.put('/:id', auth, function (req, res) {
        res.send('This is not implemented now');
    });

    /* Delete existing product */
    router.delete('/:id', auth, function (req, res) {
        res.send('This is not implemented now');
    });

    return router;
}