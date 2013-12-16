angular.module('cupcakeDashboard')
  .service('ThemeService', function Projects($http, $q, $angularCacheFactory) {

    var _cache = $angularCacheFactory('themeCache');

     return {

      getThemes: function () {
        var defer = $q.defer();
        $http.get('/api/themes', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      }

    };

  });