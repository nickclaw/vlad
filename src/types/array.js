var e = require('../errors'),
    util = require('../util'),
    property = require('../property'),
    identity = require('lodash/identity');

var array = property.extend();
array._type = 'array';

array.validate = function(array) {
    if (!Array.isArray(array))
        throw e.FieldValidationError("Not an array.");

    if (this._min !== undefined && array.length < this._min)
        throw e.FieldValidationError("Array too short.");

    if (this._max !== undefined && array.length > this._max)
        throw e.FieldValidationError("Array too long.");

    var validator = this._validator || identity;

    var didFail = false;
    var errs = new Array(array.length);
    var vals = new Array(array.length);

    array.forEach(function(val, key) {
        try {
            vals[key] = validator(val);
        } catch (e) {
            didFail = true;
            errs[key] = e;
        }
    }, {});

    if (didFail) {
        throw new e.ArrayValidationError('Invalid array.', errs);
    } else {
        return vals;
    }
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
