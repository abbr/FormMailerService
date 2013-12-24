'use strict';

describe('Service: Users', function() {

  // load the service's module
  beforeEach(module('formMailerServiceApp'));

  // instantiate service
  var Users;
  beforeEach(inject(function(_Users_) {
    Users = _Users_;
  }));

  it('should be resource ', function() {
    expect(Users.name).toBe('Resource');
  });

});
