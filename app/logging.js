'use strict';

var process = require('process');

var winston = require('winston');

var SYSLOG_APP_NAME = process.env.SYSLOG_APP_NAME || 'yrdenzeichen';
var LOG_LEVEL = process.env.LOG_LEVEL || 'info';

function replacer(key, value) {
  if (typeof value === 'function') {
    return value.name;
  }
  return value;
}

var logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.json({ stable: true })
  ),
  defaultMeta: {
    service: SYSLOG_APP_NAME,
  },
  transports: [new winston.transports.Console()],
});

logger.info(
  'Logging initialized at level: ' +
    LOG_LEVEL +
    ', with label: ' +
    SYSLOG_APP_NAME
);

module.exports = {
  logger: logger,
  replacer: replacer,
};
