/**
 * Created by Aloyan Dmitry on 07.10.2015
 */
var express = require('express');
var router = express.Router();

/* GET list of products */
router.get('/api/products', function(req, res) {
    res.send('This is not implemented now');
});

/* GET product info */
router.get('/api/products/:id', function(req, res) {
    res.send('This is not implemented now');
});

/* Create new product */
router.post('/api/products', function(req, res) {
    res.send('This is not implemented now');
});

/* Update existing product */
router.put('/api/products/:id', function(req, res) {
    res.send('This is not implemented now');
});

/* Delete existing product */
router.delete('/api/products/:id', function(req, res) {
    res.send('This is not implemented now');
});

module.exports = router;