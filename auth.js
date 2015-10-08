/**
 * Created by Aloyan Dmitry on 08.10.2015
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

module.exports = function(app){
    router.use(function(req, res, next){
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if( !token ) {
            return res.send({
                success: false,
                message: 'No token provided'
            });
        }
        jwt.verify(token, app.get('superSecret'), function(err, decoded){
            if( err ){
                return res.send({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            }
            req.user = decoded;
            next();
        });
    });

    return router;
}