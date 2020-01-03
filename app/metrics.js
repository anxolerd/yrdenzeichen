'use strict';

var opentelemetry = require('@opentelemetry/metrics');

var meter = new opentelemetry.Meter();

var httpRequestsCount = meter.createCounter('http_requests_count', {
  monotonic: true,
  description: 'Requests served',
});

var validationsCount = meter.createCounter('validations_count', {
  monotonic: true,
  labelKeys: ['namespace', 'resource', 'successfull'],
  description: 'validations performed',
});

var rulesTriggered = meter.createCounter('rules_triggered_count', {
  monotonic: true,
  labelKeys: ['namespace', 'resource', 'rule'],
  description: 'amount of times some rule was triggered',
});

module.exports = {
  meter: meter,
  httpRequestsCount: httpRequestsCount,
  validationsCount: validationsCount,
  rulesTriggered: rulesTriggered,
};
