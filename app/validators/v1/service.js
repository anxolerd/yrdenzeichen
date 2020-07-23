'use strict';

function shouldNotUseExternalIPs(serviceObject) {
  var result = {
    valid: true,
    errors: [],
  };
  if (
    serviceObject.spec.externalIPs !== undefined &&
    serviceObject.spec.externalIPs !== null
  ) {
    result.valid = false;
    result.errors.push(
      'Service ' + serviceObject.metadata.name + ' uses `externalIPs`'
    );
  }
  return result;
}

module.exports = {
  shouldNotUseExternalIPs: shouldNotUseExternalIPs,
};
