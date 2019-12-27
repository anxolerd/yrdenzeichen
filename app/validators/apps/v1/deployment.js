'use strict';


function validateImageTag(deploymentObject) {
    var result = {
        valid: true,
        errors: [],
    };
    var containers = deploymentObject.spec.template.spec.containers;
    containers.forEach(function(container) {
        var imageAndTag = container.image.split(':');
        if (imageAndTag.length === 1) {
            result.valid = false;
            result.errors.push('Container ' + conrainer.name + ' does not have image tag set');
        }
        if (imageAndTag.length === 2 && imageAndTag[1] === 'latest') {
            result.valid = false;
            result.errors.push('Container ' + conrainer.name + ' uses image with `latest` tag');
        }
    });
    return result;
}


function validateImagePullPolicy(deploymentObject) {
    var result = {
        valid: true,
        errors: [],
    };
    var containers = deploymentObject.spec.template.spec.containers;
    containers.forEach(function(container) {
        var imagePullPolicy = container.imagePullPolicy;
        if (imagePullPolicy === 'Always') {
            result.valid = false;
            result.errors.push('Container ' + conrainer.name + ' uses imagePullPolicy `Always`');
        }
    });
    return result;
}


var VALIDATION_CHAIN = [
    validateImageTag,
    validateImagePullPolicy,
]


function validate(deploymentObject) {
    var result = {
        valid: true,
        errors: [],
    };
    VALIDATION_CHAIN.forEach(function(validator) {
        var r = validator(deploymentObject);
        result.valid = result.valid && r.valid;
        result.errors.concat(r.errors);
    });
    var admissionResult = {
        allowed: result.valid,
    };
    if (!result.valid) {
        admissionResult.status = {
            'code': 400,
            'message': result.errors.join('; '),
        }
    }
    return admissionResult;
}


module.exports = validate;
