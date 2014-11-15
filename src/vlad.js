var _ = require('lodash'),
    util = require('./util'),
    validate = require('jsonschema').validate;


module.exports = vlad;

/**
 * vlad validator factory
 * Returns a function that can be used to validate objects
 * @param {Object} schema
 * @return {Function}
 */
function vlad(schema) {

    // Process the passed in schema into valid jsonschema.
    // Simply calling the property.js objects toSchema function if
    // it exists, otherwise assume that it is already valid schema
    // or a 'vladitate' function
    schema = _.reduce(schema, reduceSchema, {});

    /**
     * Validates the object based on the passed in schema
     * @param {*} obj
     * @return {Promise}
     */
    return function vladidate(obj, callback) {
        var o = Object.create(null);

        for (key in schema) {
            var result = resolve(schema[key], obj[key]);
            if (result.errors) return result.errors[0].message;
            o[key] = result.instance;
        }

        return o;
    }
}

util.defineProperties(vlad, {
    string: require('./types/string'),
    number: require('./types/number'),
    integer: require('./types/integer')
});

/**
 * Special case for enums
 * @param {Array} enums
 * @param {*=} def - default value (must be in enums)
 */
vlad.enum = function createEnum(enums, def) {
    return {
        'enum': enums,
        'default': def
    };
}


//
// Util
//

// Schema mapping function, so we don't create a new closure very time
function reduceSchema(memo, value, key) {
    memo[key] = typeof value.toSchema === 'function' ? value.toSchema() : value;
    return memo;
}

/**
 * Resolve a schema rule or function against a value
 * @param {Function|Object} rule
 * @param {*} value
 * @return {Function}
 */
function resolve(rule, value) {
    var result;
    if (typeof rule === 'function') {
        result = rule(value);
    } else {
        result = validate(value, rule);
    }

    return result;
}
