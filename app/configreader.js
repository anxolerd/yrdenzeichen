'use strict';

var log = require('./logging').logger;
var validators = require('./validators');

function readConfig(path) {
  if (path === undefined) {
    path = './config';
  }

  var config = { validators: {} };
  var definition = require('./config');

  var groupValidators, versionValidators;
  for (var group in definition) {
    if (!Object.prototype.hasOwnProperty.call(definition, group)) {
      continue;
    }

    if (validators[group.toLowerCase()] === undefined) {
      log.warn('api group `' + group.toLowerCase() + '` is not suppported yet');
      continue;
    }
    groupValidators = validators[group.toLowerCase()];

    for (var version in definition[group]) {
      if (!Object.prototype.hasOwnProperty.call(definition[group], version)) {
        continue;
      }

      if (groupValidators[version.toLowerCase()] === undefined) {
        log.warn(
          'api version `' + group + '/' + version + '` is not suppported yet'
        );
        continue;
      }
      versionValidators = groupValidators[version.toLowerCase()];

      for (var kind in definition[group][version]) {
        if (
          !Object.prototype.hasOwnProperty.call(
            definition[group][version],
            kind
          )
        ) {
          continue;
        }
        if (versionValidators[kind.toLowerCase()] === undefined) {
          log.warn(
            'api kind `' +
              group +
              '/' +
              version +
              '/' +
              kind +
              '` is not suppported yet'
          );
          continue;
        }

        var validationChain = [];
        definition[group][version][kind].forEach(function(validatorName) {
          var validator = versionValidators[kind.toLowerCase()][validatorName];
          if (validator === undefined) {
            log.warn(
              'validator `' +
                validatorName +
                '` for api kind `' +
                group +
                '/' +
                version +
                '/' +
                kind +
                '` is not implemented yet'
            );
            return;
          }
          validationChain.push(validator);
        });
        var resourcePath = (group + '/' + version + '/' + kind).toLowerCase();
        config.validators[resourcePath] = validationChain;
      }
    }
  }
  return config;
}

module.exports = {
  readConfig: readConfig,
};
