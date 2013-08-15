angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $resource, $stateParams, $location, PhaseService) {
    var projectId = $stateParams.id;

    var Project = $resource('http://localhost\\:3000/api/projects/:id', { cache: true , isArray: false});
    $scope.project = Project.get({id: projectId});
  });
