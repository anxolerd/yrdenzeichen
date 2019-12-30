const _common = require('../_common');

describe('shouldSetImageTag', function() {
  test('passes when tag is set', function() {
    expect(
      _common.shouldSetImageTag({
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
      errors: ['Container testContainer does not have image tag set'],
    });
  });

  test('checks all containers', function() {
    expect(
      _common.shouldSetImageTag({
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
        'Container testContainer1 does not have image tag set',
        'Container testContainer2 does not have image tag set',
      ],
    });
  });
});

describe('shouldNotUseTagLatest', function() {
  test('passes when tag is set and tag is not latest', function() {
    expect(
      _common.shouldNotUseTagLatest({
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
      errors: ['Container testContainer uses image with `latest` tag'],
    });
  });

  test('checks all containers', function() {
    expect(
      _common.shouldNotUseTagLatest({
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
        'Container testContainer1 uses image with `latest` tag',
        'Container testContainer2 uses image with `latest` tag',
      ],
    });
  });
});

describe('shouldNotUsePullPolicyAlways', function() {
  test('passes when imagePullPolicy set and imagePullPolicy is not `Always`', function() {
    expect(
      _common.shouldNotUsePullPolicyAlways({
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
      errors: ['Container testContainer1 uses imagePullPolicy `Always`'],
    });
  });
  test('checks all containers', function() {
    expect(
      _common.shouldNotUsePullPolicyAlways({
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
        'Container testContainer1 uses imagePullPolicy `Always`',
        'Container testContainer2 uses imagePullPolicy `Always`',
      ],
    });
  });
});

describe('shouldSetRequestsLimits', function() {
  test('passes when requests and limits are set', function() {
    expect(
      _common.shouldSetRequestsLimits({
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
      errors: ['Container testContainer does not have resources limits set'],
    });
  });

  test('fails when requests are set and limits are partially [memory] set', function() {
    expect(
      _common.shouldSetRequestsLimits({
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
      errors: ['Container testContainer does not have CPU limits set'],
    });
  });

  test('fails when requests are set and limits are partially [CPU] set', function() {
    expect(
      _common.shouldSetRequestsLimits({
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
      errors: ['Container testContainer does not have memory limits set'],
    });
  });

  test('fails when requests are partially [CPU] set and limits are set', function() {
    expect(
      _common.shouldSetRequestsLimits({
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
      errors: ['Container testContainer does not have memory requests set'],
    });
  });
  test('fails when requests are partially [memory] set and limits are set', function() {
    expect(
      _common.shouldSetRequestsLimits({
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
      errors: ['Container testContainer does not have CPU requests set'],
    });
  });
  test('fails when requests are not set and limits are not set', function() {
    expect(
      _common.shouldSetRequestsLimits({
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
        'Container testContainer does not have resources limits set',
        'Container testContainer does not have resources requests set',
      ],
    });
  });
  test('fails when resources are not set', function() {
    expect(
      _common.shouldSetRequestsLimits({
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
        'Container testContainer does not have resources requirements set',
      ],
    });
  });
});
