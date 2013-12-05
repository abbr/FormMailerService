'use strict';

describe('Service: Sites', function () {

  // load the service's module
  beforeEach(module('formMailerServiceApp'));

  // instantiate service
  var Sites;
  beforeEach(inject(function (_Sites_) {
    Sites = _Sites_;
  }));

  it('should do something', function () {
    expect(!!Sites).toBe(true);
  });

});
