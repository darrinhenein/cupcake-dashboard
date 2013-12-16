angular.module('cupcakeDashboard')
  .service('UIHelperService', function Phases($http, $q, $angularCacheFactory) {

    var _cache = $angularCacheFactory('uiCache');

    this.phases = function(){
      var defer = $q.defer();
      $http.get('/api/phases', {
            cache: _cache
        }).success(function(res){
          defer.resolve(res);
        });
      return defer.promise;
    }

    this.statuses = function(){
      var defer = $q.defer();
      $http.get('/api/statuses', {
            cache: _cache
        }).success(function(res){
          defer.resolve(res);
        });
      return defer.promise;
    }

    this.displayName = function(user){
      if(!user)
      {
        return;
      }

      if(user.first_name || user.last_name)
      {
        return user.first_name + ' ' + user.last_name;
      }
      else
      {
        return user.email;
      }
    }
    this.displayNameShort = function(user){
      if(!user)
      {
        return;
      }

      if(user.first_name)
      {
        return user.first_name;
      }
      else
      {
        return user.email;
      }
    }
});
