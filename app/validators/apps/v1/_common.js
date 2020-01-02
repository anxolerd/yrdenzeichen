'use strict';

function shouldSetImageTag(object) {
  var result = {
    valid: true,
    errors: [],
  };
  var containers = object.spec.template.spec.containers;
  containers.forEach(function(container) {
    var imageAndTag = container.image.split(':');
    if (imageAndTag.length === 1) {
      result.valid = false;
      result.errors.push(
        'Container ' + container.name + ' does not have image tag set'
      );
    }
  });
  return result;
}

function shouldNotUseTagLatest(object) {
  var result = {
    valid: true,
    errors: [],
  };
  var containers = object.spec.template.spec.containers;
  containers.forEach(function(container) {
    var imageAndTag = container.image.split(':');
    if (imageAndTag.length === 2 && imageAndTag[1] === 'latest') {
      result.valid = false;
      result.errors.push(
        'Container ' + container.name + ' uses image with `latest` tag'
      );
    }
  });
  return result;
}

function shouldNotUsePullPolicyAlways(object) {
  var result = {
    valid: true,
    errors: [],
  };
  var containers = object.spec.template.spec.containers;
  containers.forEach(function(container) {
    var imagePullPolicy = container.imagePullPolicy;
    if (imagePullPolicy === 'Always') {
      result.valid = false;
      result.errors.push(
        'Container ' + container.name + ' uses imagePullPolicy `Always`'
      );
    }
  });
  return result;
}

function shouldSetRequestsLimits(object) {
  var result = {
    valid: true,
    errors: [],
  };
  var containers = object.spec.template.spec.containers;
  containers.forEach(function(container) {
    var resources = container.resources;
    if (resources === undefined) {
      result.valid = false;
      result.errors.push(
        'Container ' +
          container.name +
          ' does not have resources requirements set'
      );
      return;
    }

    if (resources.limits === undefined) {
      result.valid = false;
      result.errors.push(
        'Container ' + container.name + ' does not have resources limits set'
      );
    } else {
      if (resources.limits.cpu === undefined) {
        result.valid = false;
        result.errors.push(
          'Container ' + container.name + ' does not have CPU limits set'
        );
      }
      if (resources.limits.memory === undefined) {
        result.valid = false;
        result.errors.push(
          'Container ' + container.name + ' does not have memory limits set'
        );
      }
    }

    if (resources.requests === undefined && resources.limits === undefined) {
      // According to the Kubernetes API Reference:
      //   If Requests is omitted for a container, it defaults to Limits if
      //   that is explicitly specified, otherwise to an
      //   implementation-defined value.
      //   --- https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.15/#resourcerequirements-v1-core
      // So we consider missing resources requests invalid if and only if
      // resources limits are missing as well
      result.valid = false;
      result.errors.push(
        'Container ' + container.name + ' does not have resources requests set'
      );
    } else if (resources.requests !== undefined) {
      if (resources.requests.cpu === undefined) {
        result.valid = false;
        result.errors.push(
          'Container ' + container.name + ' does not have CPU requests set'
        );
      }
      if (resources.requests.memory === undefined) {
        result.valid = false;
        result.errors.push(
          'Container ' + container.name + ' does not have memory requests set'
        );
      }
    }
  });
  return result;
}

function shouldNotUseMegasharesForCPU(object) {
  var result = {
    valid: true,
    errors: [],
  };

  var containers = object.spec.template.spec.containers;
  containers.forEach(function(container) {
    var resources = container.resources;
    if (resources === undefined) return;
    if (
      resources.requests !== undefined &&
      resources.requests.cpu !== undefined
    ) {
      var cpuRequest = resources.requests.cpu;
      if (/^\d+[KMG]i$/.test(cpuRequest)) {
        result.valid = false;
        result.errors.push(
          'Container ' +
            container.name +
            ' uses invalid measurement unit for CPU request'
        );
      }
    }
    if (resources.limits !== undefined && resources.limits.cpu !== undefined) {
      var cpuLimit = resources.limits.cpu;
      if (/^\d+[KMG]i$/.test(cpuLimit)) {
        result.valid = false;
        result.errors.push(
          'Container ' +
            container.name +
            ' uses invalid measurement unit for CPU limit'
        );
      }
    }
  });

  return result;
}

function shouldNotUseMillisharesForMemory(object) {
  var result = {
    valid: true,
    errors: [],
  };

  var containers = object.spec.template.spec.containers;
  containers.forEach(function(container) {
    var resources = container.resources;
    if (resources === undefined) return;
    if (
      resources.requests !== undefined &&
      resources.requests.memory !== undefined
    ) {
      var memoryRequest = resources.requests.memory;
      if (/^\d+m$/.test(memoryRequest)) {
        result.valid = false;
        result.errors.push(
          'Container ' +
            container.name +
            ' uses invalid measurement unit for memory request'
        );
      }
    }
    if (
      resources.limits !== undefined &&
      resources.limits.memory !== undefined
    ) {
      var memoryLimit = resources.limits.memory;
      if (/^\d+m/.test(memoryLimit)) {
        result.valid = false;
        result.errors.push(
          'Container ' +
            container.name +
            ' uses invalid measurement unit for memory limit'
        );
      }
    }
  });
  return result;
}

module.exports = {
  shouldSetImageTag: shouldSetImageTag,
  shouldNotUseTagLatest: shouldNotUseTagLatest,
  shouldNotUsePullPolicyAlways: shouldNotUsePullPolicyAlways,
  shouldSetRequestsLimits: shouldSetRequestsLimits,
  shouldNotUseMegasharesForCPU: shouldNotUseMegasharesForCPU,
  shouldNotUseMillisharesForMemory: shouldNotUseMillisharesForMemory,
};
