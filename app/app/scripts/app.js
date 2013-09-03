angular.module('cupcakeDashboard', ['ngResource', 'ui.state', 'angular-tools.persona'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('base', {
        url: '/',
        templateUrl: 'views/themes.html',
        controller: 'ThemesCtrl'
      })
        .state('theme', {
          url: '/theme/:id',
          templateUrl: 'views/theme.html',
          controller: 'ThemeCtrl'
        })
        .state('projects', {
          url: '/projects',
          templateUrl: 'views/projects.html',
          controller: 'ProjectsCtrl'
        })
        .state('projects.new', {
          url: '/projects/new',
          templateUrl: 'views/projects.new.html',
          controller: 'ProjectsCtrl'
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
        templateUrl: 'views/projects.html',
        controller: 'PhaseCtrl'
      })
  })
  .run(function ($rootScope, $http){
    // get session user
    $http.get('/getUser').then(function(res){
      $rootScope.loggedInUser = {email: res.data.logged_in_email};
    });
  });
