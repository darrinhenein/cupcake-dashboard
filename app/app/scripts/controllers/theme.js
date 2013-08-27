angular.module('cupcakeDashboard')
  .controller('ThemeCtrl', function ($scope, $resource, $stateParams, UIHelperService) {
    var themeId = $stateParams.id;

    var Theme = $resource('/api/themes/:id', { cache: false, isArray: false});
    $scope.theme = Theme.get({id: themeId});

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
