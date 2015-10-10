var express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();
var app = express();
var User = require('./../models/user.js');

module.exports = function(app, auth) {
    router.post('/authenticate', function (req, res) {
        if (!req.body.username || !req.body.password) {
            return res.send({
                success: false,
                message: 'Bad parameters'
            });
        }

        User.findOne({
            username: req.body.username,
            password: User.hashPwd(req.body.password)
        }, function (err, user) {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Internal server error',
                    err: err
                });
            }
            if (!user) {
                return res.send({
                    success: false,
                    message: 'User not found'
                });
            } else {
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.send({
                    success: true,
                    token: token,
                    user: user.toPublic()
                })
            }
        });
    });

    // TODO don't access to this route if user logged in
    router.post('/signin', function (req, res) {
        if (!req.body.username || !req.body.password) {
            return res.send({
                success: false,
                message: 'Bad parameters'
            });
        }

        var newUser = new User({
            username: req.body.username,
            password: User.hashPwd(req.body.password)
        });
        newUser.save(function (err) {
            if (err) {
                if( err.code === 11000 ) {
                    return res.send({
                        success: false,
                        message: 'User already exist',
                        err: err
                    });
                }
                return res.send({
                    success: false,
                    err: err
                });
            }
            return res.send({
                success: true,
                user: newUser.toPublic()
            });
        })
    });

    router.get('/logout', auth, function (req, res) {
        res.clearCookie('token');
        req.user = {};
        res.send({
            success: true,
            user: {}
        })
    });

    router.get('/', auth, function (req, res) {
        res.send({
            success: true,
            user: req.user
        })
    });

    return router;
}
