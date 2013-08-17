angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $resource, $stateParams, $location, $rootScope, PhaseService) {
    var projectId = $stateParams.id;

    var Project = $resource('/api/projects/:id', {cache: false, isArray: false},
      { update: {
        method: 'PUT',
        params:
         {id: projectId}
      }});
    var project = $scope.project = Project.get({id: projectId});

    // is there a better way?
    $scope.tempPhases = {0:{}, 1:{}, 2:{}, 3:{}, 4:{}, 5:{}};

    // needed for edit
    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });

    $scope.save = function(){
      if($rootScope.loggedInUser.email==project.owner_email){
        if(!project.phases){
          project.phases = $scope.tempPhases;
        } else {
          // fix this ugly loop
          for(i=0;i<=6;i++){
            if(!project.phases[i] && $scope.tempPhases[i]){
              project.phases[i] = {body: $scope.tempPhases[i].body};
            }
          }
        }
        project.$update();
      }
      $location.path('project/' + project._id + '/' + project.phase);
    }
  });
