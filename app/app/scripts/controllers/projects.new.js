angular.module('cupcakeDashboard')
  .controller('NewProjectsCtrl', function ($scope, $rootScope, $location, $resource, UIHelperService) {

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false});

    $scope.project = new Project();
    $scope.project.owner = $rootScope.loggedInUser._id;

    $scope.save = function(){
      $scope.project.$save(function(data){
        $location.url("/projects");
      });
    }
  });
