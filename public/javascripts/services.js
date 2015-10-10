'use strict';

var app = angular.module('ProdApp.Services', []);

app.factory('Products', ['API', function (API) {
    return {
        getList: function (callback, start, limit) {
            if (start == undefined) {
                start = 0;
            }
            if (limit == undefined) {
                limit = 10;
            }
            API('get', '/api/products', {start: start, limit: limit}, function (data) {
                if (Array.isArray(data.data)) {
                    return !callback || callback(data.data, data.count);
                }
                return !callback || callback([], 0);
            });
        },
        get: function (id, callback) {
            if (!id || !id.length) {
                return !callback || callback({});
            }
            API('get', '/api/products/' + id, {}, function (data) {
                if (typeof(data.data) === 'object') {
                    return !callback || callback(data.data);
                }
                return !callback || callback({});
            });
        },
        create: function (params, callback) {
            if (!params) {
                return !callback || callback({});
            }
            API.upload('post', '/api/products', params, function (data) {
                if (typeof(data.data) === 'object') {
                    return !callback || callback(data.data);
                }
                return !callback || callback({});
            });
        },
        update: function (id, params, callback) {
            if (!id || !id.length || !params) {
                return !callback || callback({});
            }
            API.upload('put', '/api/products/' + id, params, function (data) {
                if (typeof(data.data) === 'object') {
                    return !callback || callback(data.data);
                }
                return !callback || callback({});
            });
        },
        remove: function (id, callback) {
            if (!id || !id.length) {
                return !callback || callback(false);
            }
            API('delete', '/api/products/' + id, {}, function (data) {
                return !callback || callback(data.success);
            });
        }
    }
}]);

app.factory('User', ['$http', '$location', '$rootScope', '$cookies', 'API', function ($http, $location, $rootScope, $cookies, API) {
    var user = {};

    var setUser = function(ruser){
        user = ruser;
        //$rootScope.$apply(function(){
        //    $rootScope.user = user;
        //});
        $rootScope.user = user;
    }

    this.get = function (callback) {
        if (user && user.username) {
            return !callback || callback(user);
        }
        API('get', '/api/users', {}, function (data) {
            if (data.success) {
                setUser(data.user);
                return !callback || callback(user);
            }
            setUser({});
            return !callback || callback(user);
        }, true);
    }

    this.login = function (username, password, callback) {
        API('post', '/api/users/authenticate', {username: username, password: password}, function (data) {
            if (data.success) {
                setUser(data.user);
                return !callback || callback(user);
            }
            setUser({});
            return !callback || callback(user);
        });
    };

    this.logout = function () {
        API('get', '/api/users/logout', {}, function (data) {
            setUser({});
            $cookies.remove('token');
            $location.path('/login');
        });
    };

    this.signin = function (username, password, callback) {
        API('post', '/api/users/signin', {username: username, password: password}, function (data) {
            if (data.success) {
                setUser(data.user);
                return !callback || callback(user);
            }
            setUser({});
            return !callback || callback(user);
        });
    }
    return this;
}]);

app.factory('API', ['$http', '$rootScope', '$cookies', function ($http, $rootScope, $cookies) {
    var handleError = function (res, muteErrors) {
        if (!res.err && !res.message) {
            return $rootScope.serverErrors = [];
        }
        var error = {
            message: '',
            type: 'warning'
        };
        if (!res.message && res.err && !Array.isArray(res.err)) {
            error.message = res.err.message;
            error.type = 'danger';
        }
        if (res.message) {
            error.message = res.message;
            error.type = 'warning';
        }
        if (Array.isArray(res.err)) {
            var errArray = [];
            res.err.forEach(function (val) {
                if (val.type && val.type == 'imageupload' && !val.success) {
                    errArray.push(angular.extend(error, {
                        message: val.message,
                        type: 'warning'
                    }));
                } else {
                    errArray.push(angular.extend(error, {
                        message: val.message,
                        type: 'danger',
                    }))
                }
            });
            if (errArray.length && !muteErrors) {
                return $rootScope.serverErrors = errArray;
            }
        }
        if (error.message.length && !muteErrors) {
            return $rootScope.serverErrors = [error];
        }
    }

    var successFn = function (res, callback, muteErrors) {
        if (!res.data) {
            !callback || callback(null);
            return handleError({
                message: 'Data transfer problem'
            });
        }
        if( !res.data.success ) {
            handleError(res.data, muteErrors);
        }
        !callback || callback(res.data);
        if (res.data.success && res.data.token && res.data.token.length) {
            $cookies.put('token', res.data.token);
        }
    };

    var errorFn = function (callback, muteErrors) {
        !callback || callback(null);
        handleError({
            message: 'Connection error'
        }, muteErrors);
    };

    var fn = function (method, url, data, callback, muteErrors) {
        return $http[method](url, data).then(
            function (res) {
                successFn(res, callback, muteErrors)
            },
            function () {
                errorFn(callback, muteErrors)
            });
    }
    fn.upload = function(method, url, data, callback, muteErrors){
        var form = new FormData();
        angular.forEach(data, function(val, key){
            form.append(key, val);
        });
        return $http[method](url, form, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(
            function (res) {
                successFn(res, callback, muteErrors)
            },
            function () {
                errorFn(callback, muteErrors)
            });
    }
    return fn;
}])