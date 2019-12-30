'use strict';


function validateImageTag(object) {
    var result = {
        valid: true,
        errors: [],
    };
    var containers = object.spec.template.spec.containers;
    containers.forEach(function(container) {
        var imageAndTag = container.image.split(':');
        if (imageAndTag.length === 1) {
            result.valid = false;
            result.errors.push('Container ' + container.name + ' does not have image tag set');
        }
        if (imageAndTag.length === 2 && imageAndTag[1] === 'latest') {
            result.valid = false;
            result.errors.push('Container ' + container.name + ' uses image with `latest` tag');
        }
    });
    return result;
}


function validateImagePullPolicy(object) {
    var result = {
        valid: true,
        errors: [],
    };
    var containers = object.spec.template.spec.containers;
    containers.forEach(function(container) {
        var imagePullPolicy = container.imagePullPolicy;
        if (imagePullPolicy === 'Always') {
            result.valid = false;
            result.errors.push('Container ' + container.name + ' uses imagePullPolicy `Always`');
        }
    });
    return result;
}


function validateRequestsLimitsSet(object) {
    var result = {
        valid: true,
        errors: [],
    };
    var containers = object.spec.template.spec.containers;
    containers.forEach(function(container) {
        var resources = container.resources;
        if (resources === undefined) {
            result.valid = false;
            result.errors.push('Container ' + container.name + ' does not have resource requirements set');
            return;
        }

        if (resources.limits === undefined) {
            result.valid = false;
            result.errors.push('Container ' + container.name + ' does not have resource limits set');
        } else {
            if (resources.limits.cpu === undefined) {
                result.valid = false;
                result.errors.push('Container ' + container.name + ' does not have CPU limits set');
            }
            if (resources.limits.memory === undefined) {
                result.valid = false;
                result.errors.push('Container ' + container.name + ' does not have memory limits set');
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
            result.errors.push('Container ' + container.name + ' does not have resource requests set');
        } else if (resource.requests !== undefined) {
            if (resources.requests.cpu === undefined) {
                result.valid = false;
                result.errors.push('Container ' + container.name + ' does not have CPU requests set');
            }
            if (resources.requests.memory === undefined) {
                result.valid = false;
                result.errors.push('Container ' + container.name + ' does not have memory requests set');
            }
        }
    });
    return result;
}


module.exports = {
    'validateImageTag': validateImageTag,
    'validateImagePullPolicy': validateImagePullPolicy,
    'validateRequestsLimitsSet': validateRequestsLimitsSet,
};
