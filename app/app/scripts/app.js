angular.module('cupcakeDashboard', ['ngResource', 'ngAnimate', 'ui.state', 'angular-tools.persona'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/themes');

    $stateProvider
      .state('base', {
        url: '/themes',
        templateUrl: 'views/themes.html',
        controller: 'ThemesCtrl'
      })
        .state('profile', {
          url: '/profile',
          templateUrl: 'views/profile.html',
          controller: 'ProfileCtrl',
          auth: 1
        })
        .state('theme', {
          url: '/theme/:id',
          templateUrl: 'views/theme.html',
          controller: 'ThemeCtrl'
        })
        .state('user-themes', {
          url: '/:email/themes',
          templateUrl: 'views/user.themes.html',
          controller: 'UserThemesCtrl'
        })
        .state('new-theme', {
          url: '/themes/new',
          templateUrl: 'views/themes.new.html',
          controller: 'NewThemeCtrl',
          auth: 2
        })
        .state('projects', {
          url: '/projects',
          templateUrl: 'views/projects.html',
          controller: 'ProjectsCtrl'
        })
        .state('user-projects', {
          url: '/:email/projects',
          templateUrl: 'views/user.projects.html',
          controller: 'UserProjectsCtrl'
        })
        .state('new-project', {
          url: '/projects/new',
          templateUrl: 'views/projects.new.html',
          controller: 'NewProjectsCtrl',
          auth: 2
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
      .state('notAuthorized', {
        url: '/401',
        templateUrl: 'views/401.html'
      })
  })
  .run(function ($rootScope, $location, $http, AuthenticationService, UIHelperService){

    $rootScope.UI = UIHelperService;

    // get session user
    AuthenticationService.authenticate();

    $rootScope.permissions = AuthenticationService.getPermissions();

    $rootScope.$watch('loggedInUser', function(){
      $rootScope.permissions = AuthenticationService.getPermissions();
    });

    // sockets
    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

        $rootScope.currentPath = to.url;

        // if route requires auth and user is not logged in
        if(!to.auth) to.auth = 0;

        if (!AuthenticationService.canViewLevel(to.auth)) {
          // redirect back to login
          $location.path('/401');
        }
      });
  });
