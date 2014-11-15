var _ = require('lodash'),
    util = require('../util'),
    property = require('../property');

var number = property.extend;

//
// Property value setters
//
_.extend(number, {

    _type: 'number',

    multipleOf: function(value) {
        this._multipleOf = value;
        return this;
    },

    max: function(max) {
        this._maximum = max;
        return this;
    },

    min: function(min) {
        this._minimum = min;
        return this;
    },

    within: function(min, max) {
        this._minimum = min;
        this._maximum = max;
        return this;
    }

});

//
// Property flag setters
//
util.defineProperties(number, {

    exclusive: function() {
        this._exclusiveMaximum = true;
        this._exclusiveMinimum = true;
    }

});

module.exports = function createNumber() {
    return number.extend;
};
module.exports.property = number;
