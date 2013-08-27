angular.module('cupcakeDashboard')
  .controller('ThemesCtrl', function ($scope, $resource) {
    var Themes = $resource('/api/themes/:id', { cache: false, isArray: false});
    $scope.themes = Themes.query();
  });
