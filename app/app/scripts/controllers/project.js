angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $http, $rootScope, $resource, $location, $routeParams, UIHelperService, ProjectService, AuthenticationService) {

    var projectId = $routeParams.id;

    var Themes = $resource('/api/themes/:id');
    $scope.themes = Themes.query();

    $scope.newCollaborator = {email: ''};
    $scope.newBug = {id: ''};
    $scope.bugs = [];
    $scope.phases = [];
    $scope.statuses = [];
    $scope.projects = [];
    $scope.events = [];
    $scope.isFound = false;

    ProjectService.getProjects().then(function(data){
      $scope.projects = data;
    });

    ProjectService.getProjectEvents(projectId).then(function(data){
      $scope.events = data;
    });

    ProjectService.getProjectById(projectId).then(function(data){
      $scope.project = data;
      $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
      $scope.projectPermissions.showEdit = $scope.projectPermissions.edit;
      $scope.projectPermissions.edit = false;

      $scope.$watch('loggedInUser', function(){
        $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
        $scope.projectPermissions.showEdit = $scope.projectPermissions.edit;
        $scope.projectPermissions.edit = false;
      });

      $scope.activePhase = $routeParams.phase || $scope.project.phase;

      $scope.isFound = true;

      if($scope.project.bugs.length > 0) {
        $scope.findingBugs = true;
        ProjectService.getProjectBugs($scope.project.bugs).then(function(data){
          $scope.bugs = data.bugs;
          $scope.findingBugs = false;
        })
      }
    });

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false, id: projectId}, {
      'update': {
        method: 'put'
      }
    });

    $scope.toggleEdit = function() {
      $scope.projectPermissions.edit = !$scope.projectPermissions.edit;
      $scope.projectPermissions.showEdit = !$scope.projectPermissions.showEdit;
    }


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
      if(!$scope.statuses) return '';

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
      if($scope.newBug.id == "") return;
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
      if($scope.newCollaborator.email == "") return;
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

    $scope.updatePhaseDetails = function(data, phase){

      var path = data.path;
      var model = path.split('.')[0];
      var prop = path.split('.')[1];

      if(data.property) prop = data.property;

      // create object to PUT to server
      var obj = {};
      obj[prop] = data.value;

      var phases = $scope.project.phases;
      if(!phases)
      {
        phases = {};
      }

      phases[phase] = obj;

      Project.update({id: $routeParams.id}, {phases: phases}, function(data){
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
