angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $resource, $stateParams) {
    var projectId = $stateParams.id;

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false}, {
      update: {
        method: 'put',
        params: {
          id: projectId
        }
      }
    });

    $scope.project = Project.get({id: projectId});

    $scope.update = function(data){
      var path = Object.keys(data)[0];
      var model = path.split('.')[0];
      var prop = path.split('.')[1];

      var obj = {};
      obj[prop] = data[model + '.' + prop];

      switch(model) {
        case 'project':
          Project.update({id: projectId}, obj);
          break;
      }
    }
  });
