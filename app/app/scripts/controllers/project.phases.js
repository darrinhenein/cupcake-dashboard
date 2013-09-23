angular.module('cupcakeDashboard')
  .controller('ProjectPhasesCtrl', function ($scope, $resource, $stateParams, UIHelperService) {

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false, id: $stateParams.id}, {
      'update': {
        method: 'put'
      }
    });

    if($stateParams.phase){
      $scope.activePhase = $stateParams.phase;
    } else {
      $scope.activePhase = $scope.$parent.project.phase;
    }

    $scope.updatePhaseDetails = function(data, phase){
      var path = data.path;
      var model = path.split('.')[0];
      var prop = path.split('.')[1];

      // create object to PUT to server
      var obj = {};
      obj[prop] = data.value;

      var phases = $scope.$parent.project.phases;
      if(!phases)
      {
        phases = {};
      }

      phases[$scope.activePhase] = obj;

      Project.update({id: $stateParams.id}, {phases: phases}, function(data){
        $scope.$parent.project = data;
      });
    }

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
