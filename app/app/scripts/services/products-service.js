angular.module('cupcakeDashboard')
  .service('ProductService', function Projects($http, $q, $angularCacheFactory) {

    var _cache = $angularCacheFactory('productCache');

     return {

      getProducts: function () {
        var defer = $q.defer();
        $http.get('/api/products', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      }

    };

  });