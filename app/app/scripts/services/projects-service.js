angular.module('cupcakeDashboard')
  .service('ProjectService', function Projects($http, $q, $angularCacheFactory) {

    var _cache = $angularCacheFactory('projectCache');

     return {

      getProjects: function () {
        var defer = $q.defer();
        $http.get('/api/projects', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      },

      getProjectById: function(id) {
        var defer = $q.defer();
        $http.get('/api/projects/' + id, {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      },

      getProjectEvents: function(id) {
        var defer = $q.defer();
        $http.get('/api/projects/' + id + '/events', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      },

      getProjectBugs: function(bugs) {
        var defer = $q.defer();
        $http.get('https://api-dev.bugzilla.mozilla.org/latest/bug/?id=' + bugs.join(','), {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      }

    };

  });