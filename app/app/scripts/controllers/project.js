angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $resource, $stateParams) {
    var projectId = $stateParams.id;

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false});
    $scope.project = Project.get({id: projectId});

  });
