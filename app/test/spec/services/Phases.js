'use strict';

describe('Service: Phases', function () {

  // load the service's module
  beforeEach(module('cupcakeDashboard'));

  // instantiate service
  var Phases;
  beforeEach(inject(function (_Phases_) {
    Phases = _Phases_;
  }));

  it('should do something', function () {
    expect(!!Phases).toBe(true);
  });

});
