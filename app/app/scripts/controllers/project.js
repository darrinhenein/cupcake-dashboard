angular.module('nodeTestApp')
  .controller('ProjectCtrl', function ($scope, $resource, $stateParams, $location, PhaseService) {
    var projectId = $stateParams.id;

    var Project = $resource('http://localhost\\:3000/projects/:id', { cache: true , isArray: false});
    $scope.project = Project.get({id: projectId});
  });
