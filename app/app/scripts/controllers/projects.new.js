angular.module('cupcakeDashboard')
  .controller('NewProjectsCtrl', function ($scope, $rootScope, $location, $resource, UIHelperService) {

    var Project = $resource('/api/projects/:id', { cache: false });
    $scope.project = new Project();
    $scope.project.owner_email = $rootScope.loggedInUser.email;

    $scope.save = function(){
      $scope.project.$save(function(){
        $location.url("/projects");
      });
    }
  });
