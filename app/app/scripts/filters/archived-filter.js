angular.module('cupcakeDashboard')
  .filter('archived', [function () {
    return function (projects, show) {
      if(show === true) return projects;
      if (!angular.isUndefined(projects)) {
        var tempProjects = [];
        angular.forEach(projects, function (p) {
          if(p.status.index !== 3) tempProjects.push(p);
        });
        return tempProjects;
      } else {
        return projects;
      }
    };
  }]);