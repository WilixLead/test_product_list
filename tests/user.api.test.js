/**
 * Created by Aloyan Dmitry on 11.10.2015
 */
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');

var config = require('./../config.js');
var User = require('./../models/user.js');

describe('Users API', function () {
    var url = 'http://localhost:' + config.port + '/api/users';
    var token = '';

    before(function(done){
        if( !mongoose.isConnected ) {
            mongoose.connect(config.database);
        }
        mongoose.connection.on('connected', function(){
            // Remove test user if exist
            User.findOne({username: 'testuser'}, function(err, fuser){
                if( fuser ) {
                    fuser.remove(function(){
                        done();
                    });
                } else {
                    done();
                }
            });
        });
    });
    
    describe('signin', function(){
        it('should create new user and return his profile', function(done){
            var body = {
                username: 'testuser',
                password: 'testpassword'
            };
            request(url)
                .post('/signin')
                .send(body)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);
                    
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('_id');
                    done();
                });
        });

        it('should return duplicate error, user already exist', function(done){
            var body = {
                username: 'testuser',
                password: 'testpassword'
            };
            request(url)
                .post('/signin')
                .send(body)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);

                    res.body.should.have.property('message');
                    res.body.message.should.equal('User already exist');
                    done();
                });
        });

        it('should return error, not all params specified', function(done){
            var body = {
                username: 'testuser',
                password: ''
            };
            request(url)
                .post('/signin')
                .send(body)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);

                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);

                    res.body.should.have.property('message');
                    res.body.message.should.equal('Bad parameters');
                    done();
                });
        });
    });
    
    describe('get#Without token', function(){
        it('should return error to try get user without token', function(done){
            request(url)
                .get('/')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);
                    res.body.should.have.property('success');
                    res.body.should.have.property('message');

                    res.body.success.should.equal(false);
                    res.body.message.should.equal('No token provided');
                    done();
                });
        });
    });

    describe('authenticate#With true user creditails', function(){
        it('should return token', function(done){
            var body = {
                username: 'testuser',
                password: 'testpassword'
            };
            request(url)
                .post('/authenticate')
                .send(body)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);
                    res.body.should.have.property('success');
                    res.body.should.have.property('token');
                    res.body.should.have.property('user');

                    res.body.success.should.equal(true);

                    token = res.body.token;

                    done();
                });
        });
    });
    
    describe('get#With user token', function(){
        it('should return user by provided token', function(done){
            request(url)
                .get('/?token=' + token)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);
                    res.body.should.have.property('success');
                    res.body.should.have.property('user');

                    res.body.success.should.equal(true);
                    done();
                });
        });
    });
    
    describe('logout', function(){
        it('should clear cookie and return empty user', function(done){
            request(url)
                .get('/logout?token=' + token)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);
                    res.body.should.have.property('success');
                    res.body.should.have.property('user');

                    res.body.success.should.equal(true);
                    
                    token = '';
                    
                    done();
                });
        });
    });

    describe('get#After logout', function(){
        it('should return error, token unspecified', function(done){
            request(url)
                .get('/?token=' + token)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.equal(200);
                    res.body.should.have.property('success');

                    res.body.success.should.equal(false);
                    done();
                });
        });
    });
})