'use strict';

/* Controllers */
var app = angular.module('ProdApp.Controllers', [
    'ProdApp.Services'
]);

app.controller('MainCtrl', ['$scope', function($scope){

}]);

app.controller('LoginCtrl', ['$scope', function($scope){

}]);

app.controller('ProductCtrl', ['$scope', 'Products', function($scope, Products){
    $scope.products = [
        {title: 'asdsadsa1', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
        {title: 'asdsadsa2', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
        {title: 'asdsadsa3', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
        {title: 'asdsadsa4', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
        {title: 'asdsadsa5', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
        {title: 'asdsadsa6', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
        {title: 'asdsadsa7', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
        {title: 'asdsadsa8', description: 'veerrtgbgrft', photo: '/images/no-image.png'},
    ];
    $scope.products = [];
}])
