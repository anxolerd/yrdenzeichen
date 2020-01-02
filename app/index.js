'use strict';

// imports in the following order: stdlib, 3-rd party, local
// imports in each section ordered alphabetically
var fs = require('fs');
var http = require('http');
var https = require('https');
var process = require('process');

var express = require('express');

var log = require('./logging').logger;
var validators = require('./validators');

// constants and global variables definition
var PORT = parseInt(process.env.PORT || '3000');
var HTTPS = parseInt(process.env.HTTPS || '0') === 1;

if (HTTPS) {
  var privateKey = fs.readFileSync('/etc/ssl/server.key.pem', 'utf8');
  var certificate = fs.readFileSync('/etc/ssl/server.crt.pem', 'utf8');
  var credentials = { key: privateKey, cert: certificate };
}

function _buildConfig() {
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

var CONFIG = _buildConfig();
log.info('Configuration: ', CONFIG);

var app = express();
app.use(express.json());

// define handlers
app.post('/', function(req, res) {
  var admissionRequest = req.body;
  log.info('Got request: ', admissionRequest);
  var kind = admissionRequest.request.kind;
  var object = admissionRequest.request.object;

  var admissionResponse;

  var resourcePath = (
    kind.group +
    '/' +
    kind.version +
    '/' +
    kind.kind
  ).toLowerCase();
  var validationChain = CONFIG.validators[resourcePath];
  if (validationChain !== undefined) {
    admissionResponse = validators.validate(object, validationChain);
  } else {
    // Default response
    admissionResponse = {
      allowed: true,
    };
  }

  admissionResponse.uid = admissionRequest.request.uid;

  var admissionReview = { response: admissionResponse };
  log.info('Sending response', admissionReview);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(admissionReview));
  res.status(200).end();
});

// Start server
log.info('Listening at http://0.0.0.0:' + PORT);
var httpServer = http.createServer(app);
httpServer.listen(PORT);

if (HTTPS) {
  log.info('Listening at https://0.0.0.0:' + PORT + 1);
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT + 1);
}
