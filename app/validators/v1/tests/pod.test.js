const validateImageTag = require('../pod').validateImageTag;

test('pod.validateImageTag is set', function() {
  expect(
    validateImageTag({ spec: { containers: [{ image: 'testImageTag:tag' }] } })
  ).toEqual({
    valid: true,
    errors: [],
  });
});

test('pod.validateImageTag is not set', function() {
  expect(
    validateImageTag({ spec: { containers: [{ image: 'testImageTag', name: 'testContainer' }] } })
  ).toEqual({
    valid: false,
    errors: ['Container testContainer does not have image tag set'],
  });
});


