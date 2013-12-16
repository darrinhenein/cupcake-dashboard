angular.module('cupcakeDashboard')
  .controller('ThemesCtrl', function ($scope, ThemeService) {
    ThemeService.getThemes().then(function(data){
      $scope.themes = data;
    })
  });
