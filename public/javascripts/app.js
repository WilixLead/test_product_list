'use strict';

angular.module('ProdApp', [
    'ngRoute',
    'ProdApp.controllers',
])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/pos/login', {templateUrl: '/pos/user/login', controller: 'LoginCtrl', title: 'Авторизация'});
    $routeProvider.otherwise({redirectTo: '/'});
}])