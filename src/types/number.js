var util = require('../util'),
    property = require('../property');

var number = property.extend();
number._type = 'number';

number.parse = function parse(val) {
    return parseFloat(val);
};

//
// Property value setters
//
util.defineSetters(number, {

    multipleOf: function(value) {
        this._multipleOf = value;
    },

    max: function(max) {
        this._maximum = max;
    },

    min: function(min) {
        this._minimum = min;
    },

    within: function(min, max) {
        this._minimum = min;
        this._maximum = max;
    }

});

//
// Property flag setters
//
util.defineGetters(number, {

    exclusive: function() {
        this._exclusiveMaximum = true;
        this._exclusiveMinimum = true;
    }

});

module.exports = function createNumber() {
    return number.extend();
};
module.exports.property = number;
