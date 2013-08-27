'use strict';

describe('Controller: ThemeCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var ThemeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThemeCtrl = $controller('ThemeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
