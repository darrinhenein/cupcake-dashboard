angular.module('nodeTestApp', ['ngResource', 'ui.state'])
  .config(function ($routeProvider, $httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {

    //$locationProvider.html5Mode(true);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('base', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
        .state('project', {
          url: '/project/:id',
          templateUrl: 'views/project.html',
          controller: 'ProjectCtrl'
        })
          .state('project.phases', {
            url: '/:phase',
            templateUrl: 'views/project.phases.html',
            controller: 'ProjectPhasesCtrl'
          })
      .state('phase', {
        url: '/phase/:id',
        templateUrl: 'views/main.html',
        controller: 'PhaseCtrl'
      })

    // $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'MainCtrl'
    //   })
    //   .when('/phase/:id', {
    //     templateUrl: 'views/main.html',
    //     controller: 'PhaseCtrl'
    //   })
    //   .when('/project/:id', {
    //     templateUrl: 'views/project.html',
    //     controller: 'ProjectCtrl'
    //   })
    //   .when('/project/:id/:phase', {
    //     templateUrl: 'views/project.html',
    //     controller: 'ProjectCtrl'
    //   })
    //   .otherwise({
    //     redirectTo: '/'
    //   });
  });
