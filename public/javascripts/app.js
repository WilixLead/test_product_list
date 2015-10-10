'use strict';

angular.module('ProdApp', [
    'ngRoute',
    'ngCookies',
    'ProdApp.Controllers',
    'ProdApp.Services',
    'ProdApp.Directives'
])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/login', {templateUrl: '/login', controller: 'LoginCtrl', title: 'Log in'});
    $routeProvider.when('/', {templateUrl: '/list', controller: 'ProductCtrl', title: 'Product List'});

    $routeProvider.otherwise({redirectTo: '/'});
}])
.run(['$rootScope','$location','$route','User', function($rootScope, $location, $route, User) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        User.get(function(user){
            if( !user.username && $location.path() != '/login' ){
                event.preventDefault();
                $location.path('/login');
                $route.reload();
            }else if( user.username && $location.path() == '/login' ){
                $location.path('/list');
                $route.reload();
            }
        });
    });
}]);