var _ = require('lodash'),
    util = require('../util'),
    property = require('../property');

var string = property.extend();
string._type = 'string';

//
// Property value setters
//
util.defineSetters(string, {

    maxLength: function(length) {
        this._maxLength = length;
    },

    minLength: function(length) {
        this._minLength = length;
    },

    pattern: function(pattern) {
        this._pattern = pattern;
    },

    within: function(min, max) {
        this._minLength = min;
        this._maxLength = max;
    }
});

module.exports = function createString() {
    return string.extend();
};
module.exports.property = string;
