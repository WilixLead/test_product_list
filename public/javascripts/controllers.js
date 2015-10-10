'use strict';

/* Controllers */
var app = angular.module('ProdApp.Controllers', [
    'ProdApp.Services'
]);

app.controller('MainCtrl', ['$scope', '$timeout', 'User', function($scope, $timeout, User){
    $scope.logout = function(){
        User.logout();
    }
    
    $scope.autoHideMessages = function(){
        $timeout(function(){
            $scope.serverErrors = [];
        }, 5000);
    }
}]);

app.controller('LoginCtrl', ['$scope', '$location', 'User', function($scope, $location, User){
    $scope.username = '';
    $scope.password = '';
    $scope.error = false;

    $scope.login = function(){
        User.login($scope.username, $scope.password, function(user){
            if( !user || !user.username ){
                return $scope.error = true;
            }
            $scope.error = false;
            $location.path('/list');
        });
    }

    $scope.signin = function(){
        User.signin($scope.username, $scope.password, function(user){
            if( !user || !user.username ){
                return $scope.error = true;
            }
            $scope.error = false;
            $location.path('/list');
        });
    }

    $scope.logout = function(){
        User.logout();
    }
}]);

app.controller('ProductCtrl', ['$scope', 'Products', 'SocketAPI', function($scope, Products, SocketAPI){
    $scope.page = 0;
    $scope.limit = 1000;
    $scope.productsCount = 0;
    
    $scope.getList = function(){
        Products.getList(function(items, count){
            $scope.products = items;
            $scope.productsCount = count;
        }, $scope.page, $scope.limit);
    }
    
    $scope.openProduct = function(id){
        Products.get(id, function(product){
            if( product && product._id.length ){
                $scope.product = product;
                $('#edit-dialog').modal('show');
            }
        });
    }

    $scope.createProduct = function(){
        $scope.product = {
            title: '',
            description: '',
            photo: '/images/no-image.png'
        };
        $('#edit-dialog').modal();
    }
    
    $scope.remove = function(id){
        if( confirm('Are you sure you want to delete this product?') ){
            Products.remove(id, function(success){
                if( !success ){
                    return !$scope.serverErrors[0] || alert($scope.serverErrors[0].message);
                }
                $scope.getList();
            });
        }
    }

    $scope.$on('socket:created', function(ev, product){
        $scope.getList();
    });

    $scope.$on('socket:updated', function(ev, product){
        $scope.getList();
    });

    $scope.$on('socket:removed', function(ev, id){
        var found = false;
        $scope.products.forEach(function(prod){
            if( prod._id == id ) {
                found = true;
                $scope.products.splice($scope.products.indexOf(prod), 1);
            }
        });
        if( !found ) {
            $scope.getList();
        }
    });
    
    // On init calls
    $('#edit-dialog').on('hide.bs.modal', function () {
        $scope.getList();
    });
    $scope.getList();
}]);

app.controller('ProductEditorCtrl', ['$scope', 'Products', function($scope, Products){
    $scope.error = false;
    
    $scope.save = function(){
        delete $scope.product.__v;
        if( $scope.product._id && $scope.product._id.length ){ // Update existed product
            Products.update($scope.product._id, $scope.product, function(updProduct){
                if( !updProduct || !updProduct._id ){
                    $scope.error = true;
                    return !$scope.serverErrors[0] || alert($scope.serverErrors[0].message);
                }
                $scope.error = false;
                $scope.products[$scope.products.indexOf($scope.product)] = updProduct;
                $('#edit-dialog').modal('hide');
            });
        }else{ // Create new product
            Products.create($scope.product, function(updProduct){
                if( !updProduct || !updProduct._id ){
                    $scope.error = true;
                    return !$scope.serverErrors[0] || alert($scope.serverErrors[0].message);
                }
                $scope.error = false;
                $('#edit-dialog').modal('hide');
            });
        }
    }
}]);

