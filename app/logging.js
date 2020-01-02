'use strict';

var process = require('process');

var bunyan = require('bunyan');
var BunyanFormat = require('bunyan-format');

var SYSLOG_APP_NAME = process.env.SYSLOG_APP_NAME || 'yrdenzeichen';
var LOG_LEVEL = process.env.LOG_LEVEL || 'info';
var LOG_JSON = process.env.LOG_JSON === 'true';

var logger = bunyan.createLogger({
  name: SYSLOG_APP_NAME,
  level: LOG_LEVEL,
  src: true,
  stream: new BunyanFormat({ outputMode: LOG_JSON ? 'bunyan' : 'short' }),
});

logger.info(
  'Logging initialized at level: ' +
    LOG_LEVEL +
    ', with label: ' +
    SYSLOG_APP_NAME
);
module.exports = {
  logger: logger,
};
