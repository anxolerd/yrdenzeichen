const _common = require('../_common');

describe('shouldSetImageTag', function() {
  test('passes when tag is set', function() {
    expect(
      _common.shouldSetImageTag({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                { name: 'testContainer', image: 'anxolerd/yrden:tag' },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('fails if tag is not set', function() {
    expect(
      _common.shouldSetImageTag({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [{ name: 'testContainer', image: 'anxolerd/yrden' }],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have image tag set',
      ],
    });
  });

  test('checks all containers', function() {
    expect(
      _common.shouldSetImageTag({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                { name: 'testContainer1', image: 'anxolerd/yrden' },
                { name: 'testContainer2', image: 'node' },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt does not have image tag set',
        'Container testContainer2 in Deployment Geralt does not have image tag set',
      ],
    });
  });
});

describe('shouldNotUseTagLatest', function() {
  test('passes when tag is set and tag is not latest', function() {
    expect(
      _common.shouldNotUseTagLatest({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  image: 'anxolerd/yrden:20191230:1709',
                },
              ],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });

  test('passes when tag is not set', function() {
    expect(
      _common.shouldNotUseTagLatest({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [{ name: 'testContainer', image: 'anxolerd/yrden' }],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });

  test('fails when tag is set and tag is latest', function() {
    expect(
      _common.shouldNotUseTagLatest({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                { name: 'testContainer', image: 'anxolerd/yrden:latest' },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt uses image with `latest` tag',
      ],
    });
  });

  test('checks all containers', function() {
    expect(
      _common.shouldNotUseTagLatest({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                { name: 'testContainer1', image: 'anxolerd/yrden:latest' },
                { name: 'testContainer2', image: 'node:latest' },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt uses image with `latest` tag',
        'Container testContainer2 in Deployment Geralt uses image with `latest` tag',
      ],
    });
  });
});

describe('shouldNotUsePullPolicyAlways', function() {
  test('passes when imagePullPolicy set and imagePullPolicy is not `Always`', function() {
    expect(
      _common.shouldNotUsePullPolicyAlways({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                { name: 'testContainer1', imagePullPolicy: 'IfNotPresent' },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('passes when imagePullPolicy is not set', function() {
    expect(
      _common.shouldNotUsePullPolicyAlways({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [{ name: 'testContainer1' }],
            },
          },
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('fails when imagePullPolicy is set to `Always`', function() {
    expect(
      _common.shouldNotUsePullPolicyAlways({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                { name: 'testContainer1', imagePullPolicy: 'Always' },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt uses imagePullPolicy `Always`',
      ],
    });
  });
  test('checks all containers', function() {
    expect(
      _common.shouldNotUsePullPolicyAlways({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                { name: 'testContainer1', imagePullPolicy: 'Always' },
                { name: 'testContainer2', imagePullPolicy: 'Always' },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt uses imagePullPolicy `Always`',
        'Container testContainer2 in Deployment Geralt uses imagePullPolicy `Always`',
      ],
    });
  });
});

describe('shouldSetRequestsLimits', function() {
  test('passes when requests and limits are set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {
                    requests: {
                      cpu: '100m',
                      memory: '64Mi',
                    },
                    limits: {
                      cpu: '200m',
                      memory: '128Mi',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('passes when requests are not set, but limits are set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {
                    limits: {
                      cpu: '200m',
                      memory: '128Mi',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('fails when requests are set and limits are not set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {
                    requests: {
                      cpu: '100m',
                      memory: '64Mi',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have resources limits set',
      ],
    });
  });

  test('fails when requests are set and limits are partially [memory] set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {
                    requests: {
                      cpu: '100m',
                      memory: '64Mi',
                    },
                    limits: {
                      memory: '64Mi',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have CPU limits set',
      ],
    });
  });

  test('fails when requests are set and limits are partially [CPU] set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {
                    requests: {
                      cpu: '100m',
                      memory: '64Mi',
                    },
                    limits: {
                      cpu: '200m',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have memory limits set',
      ],
    });
  });

  test('fails when requests are partially [CPU] set and limits are set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {
                    requests: {
                      cpu: '100m',
                    },
                    limits: {
                      cpu: '200m',
                      memory: '128Mi',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have memory requests set',
      ],
    });
  });
  test('fails when requests are partially [memory] set and limits are set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {
                    requests: {
                      memory: '64Mi',
                    },
                    limits: {
                      cpu: '200m',
                      memory: '128Mi',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have CPU requests set',
      ],
    });
  });
  test('fails when requests are not set and limits are not set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                  resources: {},
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have resources limits set',
        'Container testContainer in Deployment Geralt does not have resources requests set',
      ],
    });
  });
  test('fails when resources are not set', function() {
    expect(
      _common.shouldSetRequestsLimits({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer',
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in Deployment Geralt does not have resources requirements set',
      ],
    });
  });
});

describe('shouldNotUseMegasharesForCPU', function() {
  test('passes when correct units are used', function() {
    expect(
      _common.shouldNotUseMegasharesForCPU({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: { requests: { cpu: '1' }, limits: { cpu: '1.5' } },
                },
                {
                  name: 'testContainer2',
                  resources: { requests: { cpu: '100m' } },
                },
              ],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });
  test('passes when resources are missing', function() {
    expect(
      _common.shouldNotUseMegasharesForCPU({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                },
              ],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });
  test('passes when cpu resources are missing', function() {
    expect(
      _common.shouldNotUseMegasharesForCPU({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: {
                    requests: { memory: '100Mi' },
                    limits: { memory: '150Mi' },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });
  test('fails when Mega-(kilo-,giga-)shares are used in cpu request', function() {
    expect(
      _common.shouldNotUseMegasharesForCPU({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: { requests: { cpu: '1Mi' } },
                },
                {
                  name: 'testContainer2',
                  resources: { requests: { cpu: '999Gi' } },
                },
                {
                  name: 'testContainer3',
                  resources: { requests: { cpu: '76512735Ki' } },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt uses invalid measurement unit for CPU request',
        'Container testContainer2 in Deployment Geralt uses invalid measurement unit for CPU request',
        'Container testContainer3 in Deployment Geralt uses invalid measurement unit for CPU request',
      ],
    });
  });
  test('fails when Mega-(kilo-,giga-)shares are used in cpu limit', function() {
    expect(
      _common.shouldNotUseMegasharesForCPU({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: { limits: { cpu: '1Mi' } },
                },
                {
                  name: 'testContainer2',
                  resources: { limits: { cpu: '999Gi' } },
                },
                {
                  name: 'testContainer3',
                  resources: { limits: { cpu: '76512735Ki' } },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt uses invalid measurement unit for CPU limit',
        'Container testContainer2 in Deployment Geralt uses invalid measurement unit for CPU limit',
        'Container testContainer3 in Deployment Geralt uses invalid measurement unit for CPU limit',
      ],
    });
  });
});

describe('shouldNotUseMillisharesForMemory', function() {
  test('passes when correct units are used', function() {
    expect(
      _common.shouldNotUseMillisharesForMemory({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: {
                    requests: { memory: '100' },
                    limits: { memory: '20Ki' },
                  },
                },
                {
                  name: 'testContainer2',
                  resources: {
                    requests: { memory: '100Mi' },
                    limits: { memory: '20Gi' },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });
  test('passes when resources are missing', function() {
    expect(
      _common.shouldNotUseMillisharesForMemory({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                },
              ],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });
  test('passes when memory resources are missing', function() {
    expect(
      _common.shouldNotUseMillisharesForMemory({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: {
                    requests: { cpu: '1' },
                    limits: { cpu: '1' },
                  },
                },
              ],
            },
          },
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });
  test('fails when millishares are used in memory request', function() {
    expect(
      _common.shouldNotUseMillisharesForMemory({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: { requests: { memory: '100m' } },
                },
                {
                  name: 'testContainer2',
                  resources: { requests: { memory: '200m' } },
                },
                {
                  name: 'testContainer3',
                  resources: { requests: { memory: '200Mi' } },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt uses invalid measurement unit for memory request',
        'Container testContainer2 in Deployment Geralt uses invalid measurement unit for memory request',
      ],
    });
  });
  test('fails when millishares are used in memory limit', function() {
    expect(
      _common.shouldNotUseMillisharesForMemory({
        kind: 'Deployment',
        metadata: { name: 'Geralt' },
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'testContainer1',
                  resources: { limits: { memory: '100m' } },
                },
                {
                  name: 'testContainer2',
                  resources: { limits: { memory: '200m' } },
                },
                {
                  name: 'testContainer3',
                  resources: { limits: { memory: '100Mi' } },
                },
              ],
            },
          },
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in Deployment Geralt uses invalid measurement unit for memory limit',
        'Container testContainer2 in Deployment Geralt uses invalid measurement unit for memory limit',
      ],
    });
  });
});
