var e = require('../errors'),
    Promise = require('bluebird'),
    util = require('../util'),
    property = require('../property');

var boolean = property.extend();
boolean._type = 'boolean';

boolean.validate = function(value) {
    if (typeof value !== 'boolean') {
        return Promise.reject(new e.FieldValidationError("Not true or false."));
    }

    return Promise.resolve(value);
};

module.exports = function createBoolean() {
    return boolean.extend();
}
module.exports.property = boolean;
