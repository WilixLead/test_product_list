'use strict';

angular.module('ProdApp', [
    'ngRoute',
    'ProdApp.Controllers',
    'ProdApp.Services'
])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/login', {templateUrl: '/user/login', controller: 'LoginCtrl', title: 'Log in'});
    $routeProvider.when('/', {templateUrl: '/', controller: 'ProductCtrl', title: 'Product List'});

    $routeProvider.otherwise({redirectTo: '/'});
}])
.run(['$rootScope','$location','$route','User', function($rootScope, $location, $route, User) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        User.get(function(user){
            if( !user.username ){
                event.preventDefault();
                $location.path('/login');
                $route.reload();
            }else if( $location.path() == '/login' ){
                $location.path('/');
                $route.reload();
            }
        })
    });
}]);