var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Product List'});
});

router.get('/login', function (req, res) {
    res.render('login', {title: 'Authentication required'});
});

module.exports = router;
