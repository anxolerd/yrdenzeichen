'use strict';

module.exports = {
  '': {
    v1: {
      pod: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
      ],
    },
  },
  apps: {
    v1: {
      deployment: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
        'shouldSetRequestsLimits',
      ],
      statefulset: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
        'shouldSetRequestsLimits',
      ],
      replicaset: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
        'shouldSetRequestsLimits',
      ],
    },
  },
};
