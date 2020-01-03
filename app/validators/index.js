'use strict';

var metrics = require('../metrics');

function validate(object, options, validationChain) {
  var result = {
    valid: true,
    errors: [],
  };
  validationChain.forEach(function(validator) {
    var r = validator(object);
    result.valid = result.valid && r.valid;
    result.errors = result.errors.concat(r.errors);
    if (!r.valid) {
      metrics.rulesTriggered
        .getHandle(
          metrics.meter.labels({
            resource: options.resource,
            namespace: options.namespace,
            rule: validator.name,
          })
        )
        .add(1);
    }
  });
  var admissionResult = {
    allowed: result.valid,
  };
  if (!result.valid) {
    admissionResult.status = {
      code: 400,
      message: result.errors.join('; '),
    };
  }
  return admissionResult;
}

module.exports = {
  validate: validate,
  '': { v1: require('./v1') },
  apps: require('./apps'),
};
