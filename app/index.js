'use strict';

// imports in the following order: stdlib, 3-rd party, local
// imports in each section ordered alphabetically
var fs = require('fs');
var http = require('http');
var https = require('https');
var process = require('process');

var express = require('express');
var exporters = require('@opentelemetry/exporter-prometheus');

var logging = require('./logging');
var metrics = require('./metrics');
var readConfig = require('./configreader').readConfig;
var validators = require('./validators');

var log = logging.logger;

// constants and global variables definition
var PORT = parseInt(process.env.PORT || '3000');
var HTTPS_PORT =
  process.env.HTTPS_PORT !== undefined
    ? parseInt(process.env.HTTPS_PORT)
    : undefined;
var METRICS_PORT =
  process.env.METRICS_PORT !== undefined
    ? parseInt(process.env.METRICS_PORT)
    : undefined;

if (HTTPS_PORT !== undefined) {
  var privateKey = fs.readFileSync('/etc/ssl/server.key.pem', 'utf8');
  var certificate = fs.readFileSync('/etc/ssl/server.crt.pem', 'utf8');
  var credentials = { key: privateKey, cert: certificate };
}

var CONFIG = readConfig();
log.info('Configuration: %s', JSON.stringify(CONFIG, logging.replacer, 2));
var app = express();
app.use(express.json());

// define handlers
app.post('/', function(req, res) {
  var admissionRequest = req.body;
  log.info('Got request: %s', JSON.stringify(admissionRequest, null, 2));
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
    admissionResponse = validators.validate(
      object,
      { resource: resourcePath, namespace: admissionRequest.request.namespace },
      validationChain
    );
  } else {
    // Default response
    admissionResponse = {
      allowed: true,
    };
  }

  admissionResponse.uid = admissionRequest.request.uid;

  var admissionReview = { response: admissionResponse };
  metrics.httpRequestsCount.getHandle(metrics.meter.labels({})).add(1);
  metrics.validationsCount
    .getHandle(
      metrics.meter.labels({
        namespace: admissionRequest.request.namespace,
        resource: resourcePath,
        successfull: admissionResponse.allowed,
      })
    )
    .add(1);
  log.info(
    'Validation of %s %s/%s: %s',
    resourcePath,
    admissionRequest.request.namespace,
    admissionRequest.request.name,
    admissionResponse.allowed,
    {
      allowed: admissionResponse.allowed,
      object:
        admissionRequest.request.namespace +
        '/' +
        admissionRequest.request.name,
    }
  );

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(admissionReview));
  res.status(200).end();
});

// Start server
log.info('Listening at http://0.0.0.0:' + PORT);
var httpServer = http.createServer(app);
httpServer.listen(PORT);

if (HTTPS_PORT !== undefined) {
  log.info('Listening at https://0.0.0.0:' + HTTPS_PORT);
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(HTTPS_PORT);
}

if (METRICS_PORT !== undefined) {
  var exporter = new exporters.PrometheusExporter(
    {
      startServer: true,
      port: METRICS_PORT,
    },
    function() {
      log.info(
        'Listening metrics at http://0.0.0.0:' + METRICS_PORT + '/metrics'
      );
    }
  );
  metrics.meter.addExporter(exporter);
}
