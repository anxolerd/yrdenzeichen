'use strict';

module.exports = {
  '': {
    v1: {
      pod: ['validateImageTag', 'validateImagePullPolicy'],
    },
  },
  apps: {
    v1: {
      deployment: [
        'validateImageTag',
        'validateImagePullPolicy',
        'validateRequestsLimitsSet',
      ],
      statefulset: [
        'validateImageTag',
        'validateImagePullPolicy',
        'validateRequestsLimitsSet',
      ],
      replicaset: [
        'validateImageTag',
        'validateImagePullPolicy',
        'validateRequestsLimitsSet',
      ],
    },
  },
};
