angular.module('cupcakeDashboard')
  .service('ProductService', function Projects($http, DeferredWithUpdate, $window, $angularCacheFactory) {

    var _cache = $angularCacheFactory('productCache');

     return {

      getProducts: function () {
        var defer = DeferredWithUpdate.defer();
        $http.get('/api/products', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          }).error(function(data, status){
            defer.resolve({error: status});
          });
        defer.resolve($window.bootstrap.products);
        return defer.promise;
      }

    };

  });