angular.module('nodeTestApp', ['ngResource'])
  .config(function ($routeProvider, $httpProvider, $locationProvider) {

    //$locationProvider.html5Mode(true);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/phase/:id', {
        templateUrl: 'views/main.html',
        controller: 'PhaseCtrl'
      })
      .when('/project/:id', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
