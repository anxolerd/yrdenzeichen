var validators = require('../');

describe('validate', function() {
  test('passes when validationChain is empty', function() {
    expect(validators.validate({}, [])).toEqual({
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
      validators.validate({}, [testPass, testFail, testPass, testPass])
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
      validators.validate({}, [testPass, testFail, testPass, testFail])
    ).toEqual({
      allowed: false,
      status: {
        code: 400,
        message: 'This should fail; This should fail',
      },
    });
  });
});
