angular.module('cupcakeDashboard')
  .service('EventsService', function Events($http, $q, $angularCacheFactory) {

    var _cache = $angularCacheFactory('eventCache');

     return {
      getEvents: function () {
        var defer = $q.defer();
        $http.get('/api/events', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      }
    };

  });