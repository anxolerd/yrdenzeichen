'use strict';

module.exports = {
  '': {
    v1: {
      pod: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
      ],
      service: ['shouldNotUseExternalIPs'],
    },
  },
  apps: {
    v1: {
      deployment: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
        'shouldSetRequestsLimits',
        'shouldNotUseMegasharesForCPU',
        'shouldNotUseMillisharesForMemory',
      ],
      statefulset: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
        'shouldSetRequestsLimits',
        'shouldNotUseMegasharesForCPU',
        'shouldNotUseMillisharesForMemory',
      ],
      replicaset: [
        'shouldSetImageTag',
        'shouldNotUseTagLatest',
        'shouldNotUsePullPolicyAlways',
        'shouldSetRequestsLimits',
        'shouldNotUseMegasharesForCPU',
        'shouldNotUseMillisharesForMemory',
      ],
    },
  },
};
