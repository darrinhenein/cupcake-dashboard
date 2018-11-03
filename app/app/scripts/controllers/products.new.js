angular.module('cupcakeDashboard')
  .controller('NewProductCtrl', function ($scope, $rootScope, $location, $resource) {

    var Product = $resource('/api/products/:id', {});
    $scope.product = new Product();
    $scope.product.owner = $rootScope.loggedInUser._id;

    $scope.save = function(){
      $scope.product.$save(function(){
        $location.url("/products");
      });
    }
  });
