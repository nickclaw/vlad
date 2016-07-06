var util = require('../util'),
    property = require('../property'),
    e = require('../errors');

var string = property.extend();
string._type = 'string';

string.parse = function parse(val) {
    switch(typeof val) {
        case 'string': return val;
        case 'number': return String(val);
        case 'boolean': return val ? 'true' : 'false';
        default: throw new e.FieldValidationError(val + " is not a string")
    }
};

//
// Property value setters
//
util.defineSetters(string, {

    // aliases
    maxLength: function(length) {
        this._maxLength = length;
    },
    max: function(length) {
        this._maxLength = length;
    },

    // aliases
    minLength: function(length) {
        this._minLength = length;
    },
    min: function(length) {
        this._minLength = length;
    },

    pattern: function(pattern) {
        this._pattern = pattern;
    },

    format: function(format) {
        this._format = format;
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
