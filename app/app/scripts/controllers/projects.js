angular.module('cupcakeDashboard')
  .controller('ProjectsCtrl', function ($scope, $location, archivedFilter, arrayPhaseFilter, arrayThemeFilter, arrayProductFilter, $routeParams, $resource, $http, UIHelperService, EventsService) {

    $scope.filters = {
      phase: parseInt($routeParams.phase) || 'all',
      themes: {},
      products: {},
      showArchived: false
    }

    $scope.filtered = [];

    var filterProjects = function() {
      var temp = $scope.projects;
      temp = arrayProductFilter(temp, $scope.filters.products);
      temp = arrayThemeFilter(temp, $scope.filters.themes);
      temp = arrayPhaseFilter(temp, $scope.filters.phase);
      temp = archivedFilter(temp, $scope.filters.showArchived);
      return temp;
    }

    $scope.$watchCollection('filters.themes', function(){
      $scope.filtered = filterProjects();
    });

    $scope.$watchCollection('filters.products', function(){
      $scope.filtered = filterProjects();
    });

    $scope.$watchCollection('projects', function(){
      $scope.filtered = filterProjects();
    });

    $scope.$watch('filters.phase', function(){
      $scope.filtered = filterProjects();
    });

    $scope.$watch('filters.showArchived', function(){
      $scope.filtered = filterProjects();
    });

    $scope.events = EventsService.getAllEvents().then(function(res){
        $scope.events = res.data;
    });

    $scope.toggleArchived = function(){
      $scope.filters.showArchived = !$scope.filters.showArchived;
    }

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

    $scope.toggleFilter = function(type, id){
      if(type === 'theme') {

        if(id === 'clear') {
          $scope.filters.themes = _.object($scope.themes, createStateArray($scope.themes.length));
        }
        else
        {
          $scope.filters.themes[id] = !$scope.filters.themes[id];
        }

        var url = _.map($scope.filters.themes, function (item, key) {return item ? key : null})
             .filter(function (item) {return item});

        url = url.length ? url.join(',') : null;

        $location.search('themes', url);
      }
      else if(type === 'product') {

        if(id === 'clear') {
          $scope.filters.products = _.object($scope.products, createStateArray($scope.products.length));
        }
        else
        {
          $scope.filters.products[id] = !$scope.filters.products[id];
        }

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
      if($scope.filters.showArchived == true)
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
