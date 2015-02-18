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
    return Promise.settle(array.map(function(value) {
        return validator(value);
    })).then(function(results) {
        var errors = {},
            errored = false;

        for (var i = 0; i < results.length; i++) {
            if (results[i].isRejected()) {
                errored = true;
                errors["" + i] = new e.FieldValidationError(results[i].reason().message);
            }
        }

        return errored ?
            Promise.reject(new e.ArrayValidationError("Invalid array items", errors)) :
            Promise.resolve(array);
    });
};

util.defineSetters(array, {

    of: function(validator) {
        this._validator = validator;
    },

    min: function(min) {
        this._min = min;
    },

    max: function(max) {
        this._max = max;
    }

});

module.exports = function createArray() {
    return array.extend();
};
module.exports.property = array;
