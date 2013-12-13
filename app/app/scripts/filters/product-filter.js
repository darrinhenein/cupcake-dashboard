angular.module('cupcakeDashboard')
  .filter('arrayProduct', [function () {
    return function (projects, productFilter) {
      if(!_.contains(_.values(productFilter), true)) return projects;

      if (!angular.isUndefined(projects) && !angular.isUndefined(productFilter)) {
        var tempProjects = [];
        angular.forEach(projects, function (p) {
          var found = false;
          angular.forEach(p.products, function(t){
            if(!found){
              if(productFilter[t._id] === true) {
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