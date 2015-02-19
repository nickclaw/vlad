var util = require('./util'),
    error = require('./errors'),
    Promise = require('bluebird'),
    validator = require('tv4').freshApi(),
    property = require('./property'),
    Property = property.Property;

module.exports = vlad;
module.exports.promise = vlad;
module.exports.callback = callbackWrapper;
module.exports.middleware = middlewareWrapper;

/**
 * vlad validator factory
 * Returns a function that can be used to validate objects
 * @param {Object} schema
 * @return {Function}
 */
function vlad(schema) {
    if (!schema) throw new Error("No schema.");

    var json;

    // base case, handle a single property
    if (schema instanceof Property) {
        json = schema.toSchema();

        return function vladidateVal(val) {
            return resolve(json, schema, val);
        };

    // handle a custom validation function
    } else if (typeof schema === 'function') {

        return function vladidateFn(val) {
            return resolve(schema, null, val);
        };

    // handle an object of validators
    } else {
        // Process the passed in schema into valid jsonschema.
        // Simply calling the property.js objects toSchema function if
        // it exists, otherwise assume that it is already valid schema
        // or a 'vladitate' function
        json = util.reduce(schema, reduceSchema, {});

        return function vladidateObj(obj) {
            var o = Object.create(null);

            for (var key in json) {
                o[key] = resolve(json[key], schema[key], obj[key]);
            }

            return util.resolveObject(o);
        };
    }
}

//
// Types
//

util.defineGetters(vlad, {
    string: require('./types/string'),
    number: require('./types/number'),
    integer: require('./types/integer'),
    array: require('./types/array'),
    boolean: require('./types/boolean'),
    date: require('./types/date'),
    any: function() {
        return property.extend();
    }
});

/**
 * Creates a tv4 parseable enum property
 * has a different format than most properties
 * so it's created down here
 *
 * @param {Array.<String>}
 * @return {Property}
 */
vlad.enum = function(enums) {
    var prop = new Property();
    prop._enum = enums;
    return prop;
};

/**
 * Util validator for forcing a value to equal something
 * only does a shallow comparison, so will not work on objects
 *
 * @param {*} value
 * @param {String?} message - optional error message
 * @return {Property}
 */
vlad.equals = function(value, message) {
    var prop = new Property();
    prop.validate = function(val) {
        if (value !== val) {
            return Promise.reject(new error.FieldValidationError(message || (val + " does not equal " + value + ".")));
        } else {
            return Promise.resolve(val);
        }
    };
    return prop;
};

//
// Formats
//

/**
 * Adds one or more formats
 * @param {String|Object}
 * @param {Function}
 * @return vlad
 */
vlad.addFormat = function() {
    validator.addFormat.apply(validator, arguments);
    return vlad;
};


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
 * @param {Function|Object} rule
 * @param {*} value
 * @param {Promise}
 */
function resolve(rule, schema, value) {

    //
    // Handle custom function
    //
    if (typeof rule === 'function') {
        try {
            var res = rule(value);

            // if it returns a promise just return that
            if (typeof res.then === 'function') return res;

            // resolve the value
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    //
    // Handle undefined values
    //
    if (value === undefined) {
        if (rule.default !== undefined) return Promise.resolve(rule.default);
        if (rule.required) {
            if (rule.catch) return Promise.resolve(value);
            return Promise.reject(new error.FieldValidationError("Field is required."));
        }
    }

    //
    // Handle parsing properties
    //
    if (typeof schema.parse === 'function') {
        try {
            value = schema.parse(value);
        } catch (e) {

            if (rule.catch) {
                return Promise.resolve(rule.default);
            } else {
                return Promise.reject(e);
            }
        }
    }

    //
    // Handle self validating property
    //
    if (typeof schema.validate === 'function') {
        return schema.validate(value);
    }

    //
    // Fallback to tv4 validation
    //
    var result = validator.validateMultiple(value, rule);
    if (result.errors && result.errors.length) {

        // if catch is on, fall back on default or undefined
        if (rule.catch)  {
            return Promise.resolve(rule.default);
        }

        return Promise.reject( new error.FieldValidationError(result.errors[0].message));
    }
    return Promise.resolve(value);
}


//
// Wrapper functions
//

/**
 * Returns a validation function that accepts
 * a node callback rather than returning a promise
 * @param {Object} schema
 * @return {Function}
 */
function callbackWrapper(schema) {
    var validate = vlad(schema);

    return function(obj, callback) {
        validate(obj).nodeify(callback);
    };
}

/**
 * Returns a express middleware validator
 * Attempts to validate req.body (TODO make this customizable?)
 * @param {Object} schema
 * @param {String} prop - e.g. 'query', 'body', 'params', 'path', 'method'
 * @return {Function} - middleware
 */
function middlewareWrapper(schema, prop) {
    var validate = vlad(schema);
    prop || (prop = 'query');

    return function(req, res, next) {
        validate(req[prop]).then(function(data) {
            req[prop] = data;
            next(null);
        }, next);
    };
}
