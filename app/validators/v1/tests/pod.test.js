const pod = require('../pod');

describe('shouldSetImageTag', function() {
  test('passes when tag is set', function() {
    expect(
      pod.shouldSetImageTag({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [{ name: 'testContainer', image: 'anxolerd/yrden:tag' }],
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('fails if tag is not set', function() {
    expect(
      pod.shouldSetImageTag({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [{ name: 'testContainer', image: 'anxolerd/yrden' }],
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in pod geralt does not have image tag set',
      ],
    });
  });

  test('checks all containers', function() {
    expect(
      pod.shouldSetImageTag({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [
            { name: 'testContainer1', image: 'anxolerd/yrden' },
            { name: 'testContainer2', image: 'node' },
          ],
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in pod geralt does not have image tag set',
        'Container testContainer2 in pod geralt does not have image tag set',
      ],
    });
  });
});

describe('shouldNotUseTagLatest', function() {
  test('passes when tag is set and tag is not latest', function() {
    expect(
      pod.shouldNotUseTagLatest({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [
            { name: 'testContainer', image: 'anxolerd/yrden:20191230:1709' },
          ],
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });

  test('passes when tag is not set', function() {
    expect(
      pod.shouldNotUseTagLatest({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [{ name: 'testContainer', image: 'anxolerd/yrden' }],
        },
      })
    ).toEqual({ valid: true, errors: [] });
  });

  test('fails when tag is set and tag is latest', function() {
    expect(
      pod.shouldNotUseTagLatest({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [
            { name: 'testContainer', image: 'anxolerd/yrden:latest' },
          ],
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer in pod geralt uses image with `latest` tag',
      ],
    });
  });

  test('checks all containers', function() {
    expect(
      pod.shouldNotUseTagLatest({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [
            { name: 'testContainer1', image: 'anxolerd/yrden:latest' },
            { name: 'testContainer2', image: 'node:latest' },
          ],
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in pod geralt uses image with `latest` tag',
        'Container testContainer2 in pod geralt uses image with `latest` tag',
      ],
    });
  });
});

describe('shouldNotUsePullPolicyAlways', function() {
  test('passes when imagePullPolicy set and imagePullPolicy is not `Always`', function() {
    expect(
      pod.shouldNotUsePullPolicyAlways({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [
            { name: 'testContainer1', imagePullPolicy: 'IfNotPresent' },
          ],
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('passes when imagePullPolicy is not set', function() {
    expect(
      pod.shouldNotUsePullPolicyAlways({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [{ name: 'testContainer1' }],
        },
      })
    ).toEqual({
      valid: true,
      errors: [],
    });
  });

  test('fails when imagePullPolicy is set to `Always`', function() {
    expect(
      pod.shouldNotUsePullPolicyAlways({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [{ name: 'testContainer1', imagePullPolicy: 'Always' }],
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in pod geralt uses imagePullPolicy `Always`',
      ],
    });
  });
  test('checks all containers', function() {
    expect(
      pod.shouldNotUsePullPolicyAlways({
        metadata: {
          name: 'geralt',
        },
        spec: {
          containers: [
            { name: 'testContainer1', imagePullPolicy: 'Always' },
            { name: 'testContainer2', imagePullPolicy: 'Always' },
          ],
        },
      })
    ).toEqual({
      valid: false,
      errors: [
        'Container testContainer1 in pod geralt uses imagePullPolicy `Always`',
        'Container testContainer2 in pod geralt uses imagePullPolicy `Always`',
      ],
    });
  });
});
