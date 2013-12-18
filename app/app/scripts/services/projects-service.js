angular.module('cupcakeDashboard')
  .service('ProjectService', function Projects($http, DeferredWithUpdate, $window, $timeout, $angularCacheFactory) {

    var _cache = $angularCacheFactory('projectCache');

     return {

      getProjects: function () {
        var defer = DeferredWithUpdate.defer();
        if($window.bootstrap.projects) {
          defer.resolve($window.bootstrap.projects);
          _cache.put('all-projects', $window.bootstrap.projects);
          $window.bootstrap.projects = null;
        } else {
          $http.get('/api/projects', {
                cache: _cache
            }).success(function(res){
              _cache.put('all-projects', res);
              defer.resolve(res);
            }).error(function(data, status){
              defer.resolve({error: status});
            });
        }
        return defer.promise;
      },

      getProjectById: function(id) {

        var defer = DeferredWithUpdate.defer();

        var projects = _cache.get('all-projects');
        var project;

        if(projects) {
          project = _.findWhere(projects, {_id : id});
        }

        if($window.bootstrap.project) {
          defer.resolve($window.bootstrap.project);
          $window.bootstrap.project = null;
        } else {
          if(project) defer.resolve(project);
          $http.get('/api/projects/' + id, {
                cache: _cache
            }).success(function(res){
              defer.resolve(res);
            }).error(function(data, status){
              defer.resolve({error: status});
            });
        }
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