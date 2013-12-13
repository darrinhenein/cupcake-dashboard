angular.module('cupcakeDashboard')
  .controller('ProjectsCtrl', function ($scope, $location, arrayPhaseFilter, arrayThemeFilter, arrayProductFilter, $routeParams, $resource, $http, UIHelperService, EventsService) {

    $scope.filters = {
      phase: parseInt($routeParams.phase) || 'all',
      themes: {},
      products: {}
    }

    $scope.filtered = [];

    var filterProjects = function() {
      var temp = $scope.projects;
      temp = arrayProductFilter(temp, $scope.filters.products);
      temp = arrayThemeFilter(temp, $scope.filters.themes);
      temp = arrayPhaseFilter(temp, $scope.filters.phase);
      return temp;
    }

    $scope.$watchCollection('projects', function(){
      $scope.filtered = filterProjects();
    });

    $scope.$watchCollection('filters.themes', function(){
      $scope.filtered = filterProjects();
    });

    $scope.$watch('filters.phase', function(){
      $scope.filtered = filterProjects();
    });

    $scope.$watchCollection('filters.products', function(){
      $scope.filtered = filterProjects();
    });

    $scope.events = EventsService.getAllEvents().then(function(res){
        $scope.events = res.data;
    });

    var createStateArray = function(size){
      size = size > 0 ? size : 0;
      var arr = [];

      while(size--) {
        arr.push(false);
      }

      return arr;
    }

    var Themes = $resource('/api/themes/:id', { cache: false, isArray: false});
    $scope.themes = Themes.query(function(){
      $scope.filters.themes = _.object($scope.themes, createStateArray($scope.themes.length));
      if($routeParams.themes) {
        angular.forEach($routeParams.themes.split(','), function(t){
          $scope.filters.themes[t] = true;
        })
      }
    });

    var Products = $resource('/api/products/:id', { cache: false, isArray: false});
    $scope.products = Products.query(function(){
      $scope.filters.products = _.object($scope.products, createStateArray($scope.products.length));
      if($routeParams.products) {
        angular.forEach($routeParams.products.split(','), function(p){
          $scope.filters.products[p] = true;
        })
      }
    });


    var Project = $resource('/api/projects/:id', { cache: false });
    $scope.projects = Project.query();
    $scope.showArchived = false;

    $scope.archivedFilter = function(p){
      if(p.status.index == 3 && $scope.showArchived == false)
      {
        return false;
      }
      else
      {
        return true;
      }
    }

    $scope.toggleFilter = function(type, id){
      if(type === 'theme') {
        $scope.filters.themes[id] = !$scope.filters.themes[id];
        var url = _.map($scope.filters.themes, function (item, key) {return item ? key : null})
             .filter(function (item) {return item});

        url = url.length ? url.join(',') : null;

        $location.search('themes', url);
      }
      else if(type === 'product') {
        $scope.filters.products[id] = !$scope.filters.products[id];

        var url = _.map($scope.filters.products, function (item, key) {return item ? key : null})
             .filter(function (item) {return item});

        url = url.length ? url.join(',') : null;

        $location.search('products', url);
      }
      else if(type === 'phase') {
        if($scope.filters.phase === id) {
          $scope.filters.phase = 'all';
        }
        else
        {
          $scope.filters.phase = id;
        }

        var url = ($scope.filters.phase === 'all') ? null : $scope.filters.phase;
        $location.search('phase', url);
      }
    }

    $scope.showText = function(){
      if($scope.showArchived == true)
      {
        return 'Hide';
      }
      else
      {
        return 'Show';
      }
    }

    $scope.sortProjectsByDate = function(p){
      if(!p.last_updated)
      {
        return 0;
      }
      else
      {
        return p.last_updated;
      }
    }

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
