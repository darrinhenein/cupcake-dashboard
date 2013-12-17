angular.module('cupcakeDashboard')
  .controller('ThemesCtrl', function ($scope, ThemeService) {
    $scope.themes = ThemeService.getThemes().then(function(themes){
      $scope.themes = themes;
    });

    $scope.themes.update(function(themes){
      $scope.themes = themes;
    })
  });
