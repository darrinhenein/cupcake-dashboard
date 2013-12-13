angular.module('cupcakeDashboard')
  .controller('ProductCtrl', function ($scope, $resource, $location, $routeParams, UIHelperService, AuthenticationService) {
    var productId = $routeParams.id;

    var Product = $resource('/api/products/:id', { cache: false, isArray: false, id: productId}, {
      'update': {
        method: 'put'
      }
    });

    $scope.product = Product.get({id: productId}, function(){
        $scope.productPermissions = AuthenticationService.getPermissions($scope.product.product);
        $scope.isFound = true;
      }, function(res) {
        $scope.isFound = false;
      }
    );

    $scope.$watch('loggedInUser', function(){
      $scope.productPermissions = AuthenticationService.getPermissions($scope.product.product);
    });

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });

    $scope.update = function(data){
      var path = data.path;
      // product.product.prop or product.projects
      var model = path.split('.')[1];
      var prop = path.split('.')[2];

      // create object to PUT to server
      var obj = {};
      obj[prop] = data.value;

      switch(model) {
        case 'product':
          Product.update({id: productId}, obj);
          break;
      }
    }

    $scope.remove = function(){
      $scope.product.$delete(function(){
        $location.path('/products');
      });
    }

  });
