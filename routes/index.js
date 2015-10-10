var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('layout', {title: 'Product List'});
});

router.get('/list', function (req, res) {
    if( !req.xhr && req.headers.accept.indexOf('json') === -1 ) {
        return res.redirect('/');
    }
    res.render('index', {title: 'Product List'});
});

router.get('/login', function (req, res) {
    if( !req.xhr && req.headers.accept.indexOf('json') === -1 ) {
        return res.redirect('/');
    }
    res.render('login', {title: 'Authentication required'});
});

module.exports = router;
