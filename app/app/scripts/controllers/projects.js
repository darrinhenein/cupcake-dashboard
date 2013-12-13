angular.module('cupcakeDashboard')
  .controller('ProjectsCtrl', function ($scope, $location, $rootScope, $resource, $http, UIHelperService, EventsService) {


    $rootScope.navPhase = 'all';
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

    $scope.productFilter = {};
    $scope.themeFilter = {};

    var Themes = $resource('/api/themes/:id', { cache: false, isArray: false});
    $scope.themes = Themes.query(function(){
      $scope.themeFilter = _.object($scope.themes, createStateArray($scope.themes.length));
    });

    var Products = $resource('/api/products/:id', { cache: false, isArray: false});
    $scope.products = Products.query(function(){
      $scope.productFilter = _.object($scope.products, createStateArray($scope.products.length));
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
        $scope.themeFilter[id] = !$scope.themeFilter[id];
      }
      else if(type === 'product') {
        $scope.productFilter[id] = !$scope.productFilter[id];
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
