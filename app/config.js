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
        'shouldsetimagetag',
        'shouldnotusetaglatest',
        'shouldnotusepullpolicyalways',
        'shouldsetrequestslimits',
      ],
      replicaset: [
        'shouldsetimagetag',
        'shouldnotusetaglatest',
        'shouldnotusepullpolicyalways',
        'shouldsetrequestslimits',
      ],
    },
  },
};
