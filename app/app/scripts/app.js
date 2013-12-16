angular.module('cupcakeDashboard', [
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'jmdobry.angular-cache',
    'ngRoute',
    'linkify',
    'angular-tools.persona'])
  .config(function ($routeProvider, $locationProvider, $angularCacheFactoryProvider) {

    $locationProvider.html5Mode(true);

    $angularCacheFactoryProvider.setCacheDefaults({
      maxAge: 1 * 60 * 1000,
      deleteOnExpire: 'aggressive'
    });

    $routeProvider
      .when('/themes', {
        templateUrl: 'views/themes.html',
        controller: 'ThemesCtrl'
      })
      .when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductsCtrl'
      })
        .when('/profile', {
          templateUrl: 'views/profile.html',
          controller: 'ProfileCtrl',
          auth: 1
        })
        .when('/theme/:id', {
          templateUrl: 'views/theme.html',
          controller: 'ThemeCtrl'
        })
        .when('/product/:id', {
          templateUrl: 'views/product.html',
          controller: 'ProductCtrl'
        })
        .when('/:email/themes', {
          templateUrl: 'views/user.themes.html',
          controller: 'UserThemesCtrl'
        })
        .when('/themes/new', {
          templateUrl: 'views/themes.new.html',
          controller: 'NewThemeCtrl',
          auth: 2
        })
        .when('/products/new', {
          templateUrl: 'views/products.new.html',
          controller: 'NewProductCtrl',
          auth: 2
        })
        .when('/projects', {
          templateUrl: 'views/projects.html',
          controller: 'ProjectsCtrl',
          reloadOnSearch: false
        })
        .when('/:email/projects', {
          templateUrl: 'views/user.projects.html',
          controller: 'UserProjectsCtrl'
        })
        .when('/projects/new', {
          templateUrl: 'views/projects.new.html',
          controller: 'NewProjectsCtrl',
          auth: 2
        })
        .when('/project/:id/:phase?', {
          templateUrl: 'views/project.html',
          controller: 'ProjectCtrl'
        })
      .when('/phase/:id', {
        templateUrl: 'views/projects.html',
        controller: 'PhaseCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/401', {
        templateUrl: 'views/401.html'
      })
      .otherwise({
        redirectTo: '/projects'
      });
  })
  .run(function ($rootScope, $window, $location, $http, AuthenticationService, UIHelperService){

    $rootScope.UI = UIHelperService;

    // get session user
    AuthenticationService.authenticate();

    $rootScope.permissions = AuthenticationService.getPermissions();

    $rootScope.$watch('loggedInUser', function(){
      $rootScope.permissions = AuthenticationService.getPermissions();
    });

    // sockets
    $rootScope.$on('$routeChangeStart', function (e, next, current) {

        $rootScope.currentPath = next.url;
        $window.ga('send', 'pageview', $location.path());

        // if route requires auth and user is not logged in
        if(!next.auth) next.auth = 0;

        if (!AuthenticationService.canViewLevel(next.auth)) {
          // redirect back to login
          $location.path('/401');
        }
      });
  });
