'use strict';

var app = angular.module('ProdApp.Services', []);

app.factory('Products', ['$http', function ($http) {
    return {
        getList: function (callback, start, limit) {
            if (start == undefined) {
                start = 0;
            }
            if (limit == undefined) {
                limit = 10;
            }
            $http.get('/products', {start: start, limit: limit})
                .success(function (data) {
                    if (Array.isArray(data)) {
                        return callback(data);
                    }
                    return callback([]);
                })
                .error(function (data, status) {
                    callback([]);
                    // TODO add unautorize detection
                });
        },
        get: function (id, callback) {
            if (!id || !id.length) {
                return callback({});
            }
            $http.get('/products/' + id)
                .success(function (data) {
                    if (typeof(data) === 'object') {
                        return callback(data);
                    }
                    return callback({});
                })
                .error(function (data, status) {
                    callback({});
                    // TODO add unautorize detection
                });
        },
        create: function (params, callback) {
            if (!params) {
                return callback({});
            }
            $http.post('/products', params)
                .success(function (data) {
                    if (typeof(data) === 'object') {
                        return callback(data);
                    }
                    return callback({});
                })
                .error(function (data, status) {
                    callback({});
                    // TODO add unautorize detection
                });
        },
        update: function (id, params, callback) {
            if (!id || !id.length || !params) {
                return callback({});
            }
            $http.put('/products/' + id, params)
                .success(function (data) {
                    if (typeof(data) === 'object') {
                        return callback(data);
                    }
                    return callback({});
                })
                .error(function (data, status) {
                    callback({});
                    // TODO add unautorize detection
                });
        },
        remove: function (id, callback) {
            if (!id || !id.length) {
                return callback(false);
            }
            $http.delete('/products/' + id)
                .success(function (data) {
                    return callback(true);
                })
                .error(function (data, status) {
                    callback(false);
                    // TODO add unautorize detection
                });
        }
    }
}])

app.factory('User', ['$http', '$location', function ($http, $location) {
    var user = {};

    this.get = function(callback) {
        if( user && user.username ) {
            return callback(user);
        }
        $http.get('/users')
            .success(function(data, status) {
                if( data && data.username && data.username.length ) {
                    user = data;
                    return callback(user);
                }
                return callback(user);
            })
            .error(function(data, status) {
                user = {};
                callback(user);
            })
    }

    this.login = function(username, password, callback) {
        $http.post('/users/login', {username: username, password: password})
            .success(function(data, status) {
                if( data && data.username && data.username.length ) {
                    user = data;
                    return callback(user);
                }
                return callback(user);
            })
            .error(function(data, status) {
                user = {};
                callback(user);
            })
    };

    this.logout = function() {
        $http.get('/users/logout')
            .done(function() {
                user = {};
                $location.redirect('/');
            })
    };

    this.signin = function(params) {
        // TODO implement registration
    }

    return this;
}])