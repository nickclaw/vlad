var e = require('../errors'),
    Promise = require('bluebird'),
    util = require('../util'),
    property = require('../property');

var array = property.extend();
array._type = 'array';

array.validate = function(array) {
    if (!Array.isArray(array)) {
        return Promise.reject(new e.FieldValidationError("Not an array."));
    }

    if (this._min !== undefined && array.length < this._min) {
        return Promise.reject(new e.FieldValidationError("Array too short."));
    }

    if (this._max !== undefined && array.length > this._max) {
        return Promise.reject(new e.FieldValidationError("Array too long."));
    }

    var validator = this._validator || Promise.resolve;

    return Promise.settle(array.map(validator))
        .then(function(results) {
            var errored = false,
                success = [],
                errors = [];

            results.forEach(function(result, i) {
                if (result.isRejected()) {
                    errored = true;
                    errors[i] = result.reason();
                } else {
                    success[i] = result.value();
                }
            });

            return errored ?
                Promise.reject(new e.ArrayValidationError("Invalid array items", errors)) :
                Promise.resolve(array);
        });
};

util.defineSetters(array, {

    of: function(validator) {
        if (validator instanceof property.Property) {
            this._validator = require('../vlad')(validator);
        } else if (typeof validator === 'function') {
            this._validator = validator;
        } else {
            throw e.SchemaFormatError("array.of(validator) must be passed a vlad property or function.");
        }
    },

    // aliases
    minLength: function(min) {
        this._min = min;
    },
    min: function(min) {
        this._min = min;
    },

    // aliases
    maxLength: function(max) {
        this._max = max;
    },
    max: function(max) {
        this._max = max;
    }

});

module.exports = function createArray() {
    return array.extend();
};
module.exports.property = array;
