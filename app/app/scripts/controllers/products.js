angular.module('cupcakeDashboard')
  .controller('ProductsCtrl', function ($scope, ProductService) {
    ProductService.getProducts().then(function(data){
      $scope.products = data;
    })
  });
