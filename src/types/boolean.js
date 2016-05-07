var e = require('../errors'),
    util = require('../util'),
    property = require('../property');

var boolean = property.extend();
boolean._type = 'boolean';

boolean.parse = function(value) {
    switch(typeof value) {
        case 'boolean': return value;
        case 'string':
            if (value === 'true') return true;
            if (value === 'false') return false;
            break;
    }

    throw new e.FieldValidationError(value + " is not true or false.")
}

boolean.validate = function(value) {
    if (typeof value !== 'boolean')
        throw e.FieldValidationError("Not true or false.");

    return value;
};

module.exports = function createBoolean() {
    return boolean.extend();
};
module.exports.property = boolean;
