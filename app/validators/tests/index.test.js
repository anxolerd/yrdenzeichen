var validators = require('../');

var DUMMY_OPTIONS = { resource: 'dummy', namespace: 'dummy' };

describe('validate', function() {
  test('passes when validationChain is empty', function() {
    expect(validators.validate({}, DUMMY_OPTIONS, [])).toEqual({
      allowed: true,
    });
  });

  test('fails when one validator fails', function() {
    var testPass = function() {
      return { valid: true, errors: [] };
    };
    var testFail = function() {
      return { valid: false, errors: ['This should fail'] };
    };

    expect(
      validators.validate({}, DUMMY_OPTIONS, [
        testPass,
        testFail,
        testPass,
        testPass,
      ])
    ).toEqual({
      allowed: false,
      status: {
        code: 400,
        message: 'This should fail',
      },
    });
  });

  test('gets all error messages', function() {
    var testPass = function() {
      return { valid: true, errors: [] };
    };
    var testFail = function() {
      return { valid: false, errors: ['This should fail'] };
    };

    expect(
      validators.validate({}, DUMMY_OPTIONS, [
        testPass,
        testFail,
        testPass,
        testFail,
      ])
    ).toEqual({
      allowed: false,
      status: {
        code: 400,
        message: 'This should fail; This should fail',
      },
    });
  });
});
