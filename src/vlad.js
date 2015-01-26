var _ = require('lodash'),
    util = require('./util'),
    Promise = require('bluebird'),
    validator = require('tv4'),
    Property = require('./property').Property;


module.exports = vlad;

/**
 * vlad validator factory
 * Returns a function that can be used to validate objects
 * @param {Object} schema
 * @return {Function}
 */
function vlad(schema) {
    if (!schema) throw new Error("No schema.");

    if (schema instanceof Property) {
        schema = schema.toSchema();

        return function vladidateVal(val) {
            return resolve('', schema, val);
        }
    } else {
        // Process the passed in schema into valid jsonschema.
        // Simply calling the property.js objects toSchema function if
        // it exists, otherwise assume that it is already valid schema
        // or a 'vladitate' function
        schema = _.reduce(schema, reduceSchema, {});

        return function vladidateObj(obj) {
            var o = Object.create(null);

            for (key in schema) {
                o[key] = resolve(key, schema[key], obj[key]);
            }

            return util.resolveObject(o);
        }
    }
}

util.defineGetters(vlad, {
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
 * Resolve a function or jsonschema to a promise
 * @param {String} key
 * @param {Function|Object} rule
 * @param {*} value
 * @param {Promise}
 */
function resolve(key, rule, value) {
    if (typeof rule === 'function') return rule(value);

    if (value === undefined) {
        value = rule.default;
    }
    var result = validator.validateMultiple(value, rule);
    if (result.errors.length) {
        return Promise.reject(result.errors[0].message);
    }
    return Promise.resolve(value);
}
