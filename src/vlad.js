var util = require('./util'),
    error = require('./errors'),
    Promise = require('bluebird'),
    SyncPromise = require('./SyncPromise'),
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
    if (!schema) throw new error.SchemaFormatError("No schema provided.", schema);

    var json;

    // base case, handle a single property
    if (schema instanceof Property) {
        json = schema.toSchema();

        return function(val) {
            return resolve(json, schema, val);
        };

    // handle a custom validation function
    } else if (typeof schema === 'function') {

        var vladidateFn = function(val) {
            return resolve(schema, null, val);
        };
        return util.extend(vladidateFn, schema);

    // handle an object of validators
    } else if (util.isObject(schema)) {
        // Process the passed in schema into valid jsonschema.
        // Simply calling the property.js objects toSchema function if
        // it exists, otherwise assume that it is already valid schema
        // or a 'vladitate' function
        json = util.reduce(schema, reduceSchema, {});

        var vladidateObj = function(obj) {
            var o = Object.create(null);

            for (var key in json) {
                o[key] = json[key](obj[key]);
            }

            return util.resolveObject(o);
        };

        return util.extend(vladidateObj, json);
    } else {
        throw new error.SchemaFormatError("Invalid schema.", schema);
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
            return SyncPromise.reject(new error.FieldValidationError(message || (val + " does not equal " + value + ".")));
        } else {
            return SyncPromise.resolve(val);
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
    if (value instanceof Property) memo[key] = vlad(value);
    else if (typeof value === 'function') memo[key] = vlad(value);
    else throw new error.SchemaFormatError("Invalid subschema.", value);

    return memo;
}

/**
 * Resolve a function or jsonschema to a promise
 * @param {Function|Object} rule
 * @param {Property=} schema
 * @param {*} value
 * @return {Thennable}
 */
function resolve(rule, schema, value, root) {

    //
    // Handle function
    //
    if (typeof rule === 'function') {
        return SyncPromise.try(rule, [value]);
    }

    //
    // Handle undefined values
    //
    if (value === undefined) {
        if (rule.default !== undefined) return SyncPromise.resolve(rule.default);
        if (rule.required) {
            if (rule.catch) return SyncPromise.resolve(rule.default);
            return SyncPromise.reject(new error.FieldValidationError("Field is required."));
        }
        return SyncPromise.resolve(value);
    }

    //
    // Handle parsing properties
    //
    if (typeof schema.parse === 'function') {
        try {
            value = schema.parse(value);
        } catch (e) {
            if (rule.catch) {
                return SyncPromise.resolve(rule.default);
            } else {
                return SyncPromise.reject(e);
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
            return SyncPromise.resolve(rule.default);
        }

        return SyncPromise.reject( new error.FieldValidationError(result.errors[0].message));
    }
    return SyncPromise.resolve(value);
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
 * @param {String} prop - e.g. 'query', 'body', 'params', 'path', 'method'
 * @param {Object} schema
 * @return {Function} - middleware
 */
var middlewareWarn = warnOnce("vlad.middleware(schema[, prop]) has been deprecated. Use vlad.middleware([prop,] schema) instead");
function middlewareWrapper(prop, schema) {
    if (schema === undefined) {
        schema = prop;
        prop = 'query';
    } else if (typeof schema === 'string') {
        middlewareWarn();
        var tmp = schema;
        schema = prop;
        prop = tmp;
    }

    var validate = vlad(schema);

    return function(req, res, next) {
        validate(req[prop]).then(function(data) {
            req[prop] = data;
            next();
        }, next);
    };
}

function warnOnce(message) {
    var warned = false;
    return function() {
        if (!warned) {
            warned = true;
            console.warn(message);
        }
    };
}
