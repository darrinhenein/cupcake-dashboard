angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $http, $rootScope, $resource, $location, $state, $stateParams, UIHelperService, AuthenticationService) {
    var projectId = $stateParams.id;

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false, id: projectId}, {
      'update': {
        method: 'put'
      }
    });

    var Themes = $resource('/api/themes/:id');

    $scope.themes = Themes.query();
    $scope.newCollaborator = {email: ''};
    $scope.newBug = {id: ''};
    $scope.bugs = [];
    $scope.events = [];
    $scope.projects = [];

    $scope.project = Project.get({id: projectId}, function(){
        $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
        $scope.isFound = true;

        $http.get('/api/projects').then(function(res){
          $scope.projects = res.data;
        });

        if($scope.project.bugs.length > 0)
        {
          $scope.findingBugs = true;
          $http.get('https://api-dev.bugzilla.mozilla.org/latest/bug/?id=' + $scope.project.bugs.join(',')).then(function(res){
            $scope.bugs = res.data.bugs;
            $scope.findingBugs = false;
          });
        }

      }, function(res) {
        $scope.isFound = false;
      }
    );

    $scope.$watch('project', function(){
      $http.get('/api/projects/' + projectId + '/events').then(function(res){
        $scope.events = res.data;
      });
    });

    $scope.$watch('loggedInUser', function(){
      $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
    });

    $scope.addTheme = function(themeId){
      themes = [];
      for (var i = $scope.project.themes.length - 1; i >= 0; i--) {
        if($scope.project.themes[i]._id != themeId)
        {
          themes.push($scope.project.themes[i]._id);
        }
        else
        {
          return;
        }
      };
      themes.push(themeId);
      Project.update({id: projectId}, {themes: themes}, function(data){
        $scope.project = data;
      });
    }

    $scope.removeTheme = function(themeId){
      themes = [];
      for (var i = $scope.project.themes.length - 1; i >= 0; i--) {
        if($scope.project.themes[i]._id != themeId)
        {
          themes.push($scope.project.themes[i]._id);
        }
      };
      Project.update({id: projectId}, {themes: themes}, function(data){
        $scope.project = data;
      });
    }

    $scope.remove = function(){
      $scope.project.$delete(function(){
        $location.path('/projects');
      });
    }

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });

    UIHelperService.statuses().then(function(data){
      $scope.statuses = data;
    });

    $scope.statusTitle = function(index){
      for (var i = $scope.statuses.length - 1; i >= 0; i--) {
        if($scope.statuses[i].index == index) return $scope.statuses[i].title;
      };
    }

    $scope.updateStatus = function(index){
      Project.update({id: projectId}, {status: {index: index}}, function(data){
        $scope.project.status.index = data.status.index;
      });
    }

    $scope.saveRelated = function(projects){
      relatedIds = [];
      for (var i = projects.length - 1; i >= 0; i--) {
        relatedIds.push(projects[i]._id);
      };
      Project.update({id: projectId}, {status:{related: relatedIds}}, function(res){
        $scope.project.status.related = res.status.related;
      });
    }

    $scope.savePhase = function(){
      Project.update({id: projectId}, {phase: $scope.project.phase});
    }

    $scope.update = function(data){
      var path = data.path;
      var model = path.split('.')[0];
      var prop = path.split('.')[1];

      // create object to PUT to server
      var obj = {};
      obj[prop] = data.value;

      switch(model) {
        case 'project':
          Project.update({id: projectId}, obj);
          break;
      }
    }

    $scope.addBug = function(){
      var bugs = $scope.project.bugs || [];
      for (var i = bugs.length - 1; i >= 0; i--) {
        if(bugs[i] == $scope.newBug.id) {
          $scope.newBug.id = '';
          return;
        }
      };
      bugs.push($scope.newBug.id);
      Project.update({id: projectId}, {bugs: bugs}, function(data){
        $scope.project.bugs = data.bugs;
        $scope.newBug.id = '';
        $http.get('https://api-dev.bugzilla.mozilla.org/latest/bug/?id=' + $scope.project.bugs.join(',')).then(function(res){
          $scope.bugs = res.data.bugs;
        });
      });
    }

    $scope.removeBug = function(bugId){
      var bugs = $scope.project.bugs;
      newBugs = [];
      for (var i = bugs.length - 1; i >= 0; i--) {
        if(bugs[i] != bugId) {
          newBugs.push(bugs[i]);
        }
      };
      Project.update({id: projectId}, {bugs: newBugs}, function(data){
        $scope.project.bugs = data.bugs;
        $http.get('https://api-dev.bugzilla.mozilla.org/latest/bug/?id=' + $scope.project.bugs.join(',')).then(function(res){
          $scope.bugs = res.data.bugs;
        });
      });
    }

    $scope.addCollaborator = function(){
      var collabs = $scope.project.collaborators;
      for (var i = collabs.length - 1; i >= 0; i--) {
        if(collabs[i].email == $scope.newCollaborator.email || $scope.newCollaborator.email == $scope.project.owner.email)
        {
          $scope.newCollaborator.email = '';
          return;
        }
      };
      collabs.push($scope.newCollaborator);
      Project.update({id: projectId}, {collaborators: collabs}, function(data){
        $scope.newCollaborator.email = '';
        $scope.project = data;
      });
    }

    $scope.removeCollaborator = function(collab){
      var collabs = $scope.project.collaborators;
      var newCollabs = [];
      for (var i = collabs.length - 1; i >= 0; i--) {
        if(collabs[i].email != collab.email)
        {
          newCollabs.push(collabs[i]);
        }
      };
      Project.update({id: projectId}, {collaborators: newCollabs}, function(data){
        $scope.project = data;
      });

    }

    $scope.notIn = function(group){
      return function( item ) {
          for(i in group)
          {
            if(group[i]._id == item._id)
            {
              return false;
            }
          }
          return true;
      };
    }
  });
