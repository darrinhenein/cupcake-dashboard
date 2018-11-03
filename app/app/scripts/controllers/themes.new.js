angular.module('cupcakeDashboard')
  .controller('NewThemeCtrl', function ($scope, $rootScope, $location, $resource) {

    var Theme = $resource('/api/themes/:id', {});
    $scope.theme = new Theme();
    $scope.theme.owner = $rootScope.loggedInUser._id;

    $scope.save = function(){
      $scope.theme.$save(function(){
        $location.url("/themes");
      });
    }
  });
