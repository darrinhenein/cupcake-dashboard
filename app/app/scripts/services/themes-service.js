angular.module('cupcakeDashboard')
  .service('ThemeService', function Projects($http, DeferredWithUpdate, $window, $angularCacheFactory) {

    var _cache = $angularCacheFactory('themeCache');

     return {

      getThemes: function () {
        var defer = DeferredWithUpdate.defer();
        $http.get('/api/themes', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        defer.resolve($window.bootstrap.themes);
        return defer.promise;
      }

    };

  });