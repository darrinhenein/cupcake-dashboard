angular.module('cupcakeDashboard')
  .filter('arrayThemeFilter', [function () {
    return function (projects, themeFilter) {
      if(!_.contains(_.values(themeFilter), true)) return projects;

      if (!angular.isUndefined(projects) && !angular.isUndefined(themeFilter)) {
        var tempProjects = [];
        angular.forEach(projects, function (p) {
          var found = false;
          angular.forEach(p.themes, function(t){
            if(!found){
              if(themeFilter[t._id] === true) {
                tempProjects.push(p);
                found = true;
              }
            }
          });
        });
        return tempProjects;
      } else {
        return projects;
      }
    };
  }]);