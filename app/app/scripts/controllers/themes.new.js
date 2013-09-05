angular.module('cupcakeDashboard')
  .controller('NewThemeCtrl', function ($scope, $rootScope, $location, $resource) {

    var Theme = $resource('/api/themes/:id', { cache: false });
    $scope.theme = new Theme();
    $scope.theme.owner_email = $rootScope.loggedInUser.email;

    $scope.save = function(){
      $scope.theme.$save(function(){
        $location.url("/themes");
      });
    }
  });
