'use strict';

describe('Controller: ProjectCtrl', function () {

  // load the controller's module
  beforeEach(module('cupcakeDashboard'));

  var ProjectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectCtrl = $controller('ProjectCtrl', {
      $scope: scope
    });
  }));

  it('scope properties should be defined', function() {
    scope.newBug.should.be.defined;
    scope.bugs.should.have.length(0);
    scope.events.should.have.length(0);
    scope.projects.should.have.length(0);
    scope.themes.should.exist;
  });

  it('should have a new empty collaborator with an email field', function(){
    scope.newCollaborator.email.should.exist;
  });

});
