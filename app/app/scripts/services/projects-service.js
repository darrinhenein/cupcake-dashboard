angular.module('cupcakeDashboard')
  .service('ProjectService', function Projects($http, DeferredWithUpdate, $window, $timeout, $angularCacheFactory) {

    var _cache = $angularCacheFactory('projectCache');

     return {

      getProjects: function () {
        var defer = DeferredWithUpdate.defer();
        $http.get('/api/projects', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          }).error(function(data, status){
            defer.resolve({error: status});
          });
        defer.resolve($window.bootstrap.projects)
        return defer.promise;
      },

      getProjectById: function(id) {
        var defer = DeferredWithUpdate.defer();
        $http.get('/api/projects/' + id, {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          }).error(function(data, status){
            defer.resolve({error: status});
          });
        return defer.promise;
      },

      getProjectEvents: function(id) {
        var defer = DeferredWithUpdate.defer();
        $http.get('/api/projects/' + id + '/events', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          }).error(function(data, status){
            defer.resolve({error: status});
          });
        return defer.promise;
      },

      getProjectBugs: function(bugs) {
        var defer = DeferredWithUpdate.defer();
        $http.get('https://api-dev.bugzilla.mozilla.org/latest/bug/?id=' + bugs.join(','), {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          }).error(function(data, status){
            defer.resolve({error: status});
          });
        return defer.promise;
      }

    };

  });