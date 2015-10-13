/**
 * Created by Aloyan Dmitry on 12.10.2015
 */
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');

var config = require('./../config.js');
var User = require('./../models/user.js');

describe('Products API', function () {
    var url = 'http://localhost:' + config.port + '/api';
    var token = '';
    var productForUpdate_id = '';

    before(function (done) {
        console.log('\tTests started for "' + process.env.NODE_ENV + '" environment\n');
        if( !mongoose.isConnected ) {
            mongoose.connect(config.database);
        }
        async.series([
                function (callback) { // Connect to DB
                    mongoose.connection.on('connected', callback);
                },
                function (callback) { // Remove test user if exist
                    User.findOne({username: 'testuser'}, function (err, fuser) {
                        if (fuser) {
                            fuser.remove(function () {
                                callback();
                            });
                        } else {
                            callback();
                        }
                    });
                },
                function (callback) { // Sign in new user for test
                    var body = {
                        username: 'testuser',
                        password: 'testpassword'
                    };
                    request(url)
                        .post('/users/signin')
                        .send(body)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            res.status.should.equal(200);

                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);

                            res.body.should.have.property('user');
                            res.body.user.should.have.property('_id');
                            callback();
                        });
                }], // End functions array 
            function (err, results) { // Get token for new user
                var body = {
                    username: 'testuser',
                    password: 'testpassword'
                };
                request(url)
                    .post('/users/authenticate')
                    .send(body)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.status.should.equal(200);
                        res.body.should.have.property('success');
                        res.body.should.have.property('token');
                        res.body.should.have.property('user');

                        res.body.success.should.equal(true);

                        token = res.body.token;

                        done();
                    });
            });
    }); //end before

    describe('create', function () {
        it('should create new product and return product object', function (done) {
            request(url)
                .post('/products?token=' + token)
                .field('title', 'new product title')
                .field('description', 'wow product')
                .attach('file', 'tests/fixtures/prod.test.jpg')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    done();
                });
        });

        it('should create new product without image and return product object', function (done) {
            request(url)
                .post('/products?token=' + token)
                .field('title', 'new product title 2')
                .field('description', 'wow product')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');

                    productForUpdate_id = res.body.data._id;

                    done();
                });
        });
    });

    describe('update', function () {
        it('should update product and return product object', function (done) {
            request(url)
                .put('/products/' + productForUpdate_id + '?token=' + token)
                .field('title', 'We update it')
                .field('description', 'Yea. Wow product')
                .attach('file', 'tests/fixtures/prod.test.jpg')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    done();
                });
        });
    });

    describe('get', function () {
        it('should return product list', function (done) {
            request(url)
                .get('/products' + '?token=' + token)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);

                    res.body.should.have.property('data');
                    done();
                });
        });

        it('should return product by id', function (done) {
            request(url)
                .get('/products/' + productForUpdate_id + '?token=' + token)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);

                    res.body.should.have.property('data');
                    done();
                });
        });
    });

    describe('get', function () {
        it('should remove product by id', function (done) {
            request(url)
                .delete('/products/' + productForUpdate_id + '?token=' + token)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);

                    done();
                });
        });
    });
});