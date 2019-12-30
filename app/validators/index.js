"use strict";

function validate(object, validationChain) {
  var result = {
    valid: true,
    errors: []
  };
  validationChain.forEach(function(validator) {
    var r = validator(object);
    result.valid = result.valid && r.valid;
    result.errors = result.errors.concat(r.errors);
  });
  var admissionResult = {
    allowed: result.valid
  };
  if (!result.valid) {
    admissionResult.status = {
      code: 400,
      message: result.errors.join("; ")
    };
  }
  return admissionResult;
}

module.exports = {
  validate: validate,
  "": { v1: require("./v1") },
  apps: require("./apps")
};
