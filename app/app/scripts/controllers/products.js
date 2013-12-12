angular.module('cupcakeDashboard')
  .controller('ProductsCtrl', function ($scope, $resource) {
    var Products = $resource('/api/products/:id', { cache: false, isArray: false});
    $scope.products = Products.query();
  });
