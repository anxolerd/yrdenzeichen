const service = require('../service');

describe('shouldNotUseExternalIPs', function() {
  test('passes when externalIPs is not used', function() {
    var specs = [
      {
        metadata: {
          name: 'geralt',
        },
        spec: {
          type: 'ClusterIP',
          clusterIP: 'None',
          ports: [{ name: 'http', port: 8080, targetPort: 'http' }],
        },
      },
      {
        metadata: {
          name: 'geralt',
        },
        spec: {
          type: 'ExternalName',
          externalName: 'example.com.',
          ports: [{ name: 'postgres', port: 6543, targetPort: 5432 }],
        },
      },
      {
        metadata: {
          name: 'geralt',
        },
        spec: {
          type: 'ClusterIP',
          ports: [{ name: 'http', port: 8080, targetPort: 'http' }],
        },
      },
    ];
    specs.forEach(function(spec) {
      expect(service.shouldNotUseExternalIPs(spec)).toEqual({
        valid: true,
        errors: [],
      });
    });
  });

  test('fails if externalIPs is used', function() {
    expect(
      service.shouldNotUseExternalIPs({
        metadata: {
          name: 'geralt',
        },
        spec: {
          externalIPs: ['192.168.1.1'],
        },
      })
    ).toEqual({
      valid: false,
      errors: ['Service geralt uses `externalIPs`'],
    });
  });
});
