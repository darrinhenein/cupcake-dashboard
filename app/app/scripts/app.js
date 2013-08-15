angular.module('nodeTestApp', ['ngResource', 'ui.state'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

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
  });
