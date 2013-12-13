angular.module('cupcakeDashboard')
  .filter('arrayPhaseFilter', [function () {
    return function (projects, phase) {
      if(phase === 'all') return projects;
      if (!angular.isUndefined(projects) && !angular.isUndefined(phase)) {
        var tempProjects = [];
        angular.forEach(projects, function (p) {
          if(p.phase === phase) tempProjects.push(p);
        });
        return tempProjects;
      } else {
        return projects;
      }
    };
  }]);