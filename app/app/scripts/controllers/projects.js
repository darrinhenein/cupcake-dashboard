angular.module('cupcakeDashboard')
  .controller('ProjectsCtrl', function ($scope, $rootScope, $resource, $http, UIHelperService) {

    $rootScope.navPhase = 'all';

    var Project = $resource('/api/projects/:id', { cache: false });
    $scope.projects = Project.query();
    $scope.showArchived = false;

    $scope.archivedFilter = function(p){
      if(p.status.index == 3 && $scope.showArchived == false)
      {
        return false
      }
      else
      {
        return true;
      }
    }

    $scope.showText = function(){
      if($scope.showArchived == true)
      {
        return 'Hide';
      }
      else
      {
        return 'Show';
      }
    }

    $scope.$watch('projects', function(){
      $http.get('/api/events/').then(function(res){
        $scope.events = res.data;
      });
    })

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
