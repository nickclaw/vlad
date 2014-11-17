var _ = require('lodash'),
    util = require('../util'),
    property = require('../property');

var string = property.extend();

//
// Property value setters
//
_.extend(string, {

    _type: 'string',

    maxLength: function(length) {
        this._maxLength = length;
        return this;
    },

    minLength: function(length) {
        this._minLength = length;
        return this;
    },

    pattern: function(pattern) {
        this._pattern = pattern;
        return this;
    },

    within: function(min, max) {
        this._minLength = min;
        this._maxLength = max;
        return this;
    }
});

module.exports = function createString() {
    return string.extend();
};
module.exports.property = string;
