angular.module('cupcakeDashboard', ['ngResource', 'ui.state', 'angular-tools.persona'])
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
  })
  .run(function ($rootScope, $http){
    // get session user
    $http.get('/getUser').then(function(res){
      $rootScope.loggedInUser = {email: res.data.logged_in_email};
    });
  });
