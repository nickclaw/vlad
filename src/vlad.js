var util = require('./util'),
    error = require('./errors'),
    Promise = require('bluebird'),
    validator = require('tv4').freshApi(),
    property = require('./property'),
    Property = property.Property,
    each = require('lodash/each');

module.exports = promiseWrapper;
module.exports.sync = vlad;
module.exports.promise = promiseWrapper;
module.exports.callback = callbackWrapper;
module.exports.middleware = middlewareWrapper;

/**
 * vlad validator factory
 * Returns a function that can be used to validate objects
 * @param {Object} schema
 * @return {Function}
 */
function vlad(schema) {
    if (!schema) throw error.SchemaFormatError("No schema provided.", schema);

    var json;

    // base case, handle a single property
    if (schema instanceof Property) {
        json = schema.toSchema();

        return function validateProperty(val) {
            return resolve(json, schema, val);
        };

    // handle a custom validation function
    } else if (typeof schema === 'function') {

        return function validateFunction(val) {
            return resolve(schema, null, val);
        };

    // handle an object of validators
    } else if (util.isObject(schema)) {
        // Process the passed in schema into valid jsonschema.
        // Simply calling the property.js objects toSchema function if
        // it exists, otherwise assume that it is already valid schema
        // or a 'vladitate' function
        json = util.reduce(schema, reduceSchema, {});

        return function validateObject(obj) {
            var didFail = false;
            var errs = {};
            var vals = {};

            each(json, function(validator, key) {
                try {
                    vals[key] = validator(obj[key]);
                } catch (e) {
                    didFail = true;
                    errs[key] = e;
                }
            }, {});

            if (didFail) {
                throw new error.GroupValidationError('Invalid object.', errs);
            } else {
                return vals;
            }
        };
    } else {
        throw new error.SchemaFormatError("Invalid schema.", schema);
    }
}

//
// Types
//

/**
 * Add a custom validator to vlad
 * @param {String} name
 * @param {Function|Property} validator
 * @return {vlad}
 */
vlad.use = promiseWrapper.use = function(name, validator) {
    // case: Property
    if (validator instanceof Property) {
        util.defineProperty(vlad, name, validator.extend.bind(validator));
        util.defineProperty(promiseWrapper, name, validator.extend.bind(validator))
    }

    // case: Function
    else if (typeof validator === 'function') {
        var fn = function() { return validator; };
        util.defineProperty(vlad, name, fn);
        util.defineProperty(promiseWrapper, name, fn);
    }

    else throw error.SchemaFormatError("Could not add `" + name + "` validator, not an instance of Property or Function.");

    return vlad;
};


var getters = {
    string: require('./types/string'),
    number: require('./types/number'),
    integer: require('./types/integer'),
    array: require('./types/array'),
    boolean: require('./types/boolean'),
    date: require('./types/date'),
    any: function() {
        return property.extend();
    }
};

util.defineGetters(vlad, getters);
util.defineGetters(promiseWrapper, getters);

/**
 * Creates a tv4 parseable enum property
 * has a different format than most properties
 * so it's created down here
 *
 * @param {Array.<String>}
 * @return {Property}
 */
vlad.enum = promiseWrapper.enum = function(enums) {
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
vlad.equals = promiseWrapper.equals = function(value, message) {
    var prop = new Property();
    prop.validate = function(val) {
        if (value !== val) {
            throw error.FieldValidationError(message || (val + " does not equal " + value + "."));
        } else {
            return val;
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
vlad.addFormat = promiseWrapper.addFormat = function() {
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
 * @throw {ValidationError}
 * @return {Value}
 */
function resolve(rule, schema, value, root) {

    // Handle function
    if (typeof rule === 'function') {
        return util.tryFunction(rule, value);
    }

    // Handle undefined values
    if (value === undefined) {
        if (rule.default !== undefined) return rule.default;
        if (rule.required) {
            if (rule.catch) return rule.default;
            throw error.FieldValidationError("Field is required.");
        }
        return value;
    }

    // Handle parsing properties
    if (typeof schema.parse === 'function') {
        try {
            value = schema.parse(value);
        } catch (e) {
            if (rule.catch) {
                return rule.default;
            } else {
                throw e;
            }
        }
    }

    //
    // Handle self validating property
    //
    if (typeof schema.validate === 'function') {
        return util.tryFunction(schema.validate.bind(schema), value);
    }

    //
    // Fallback to tv4 validation
    //
    var result = validator.validateMultiple(value, rule);
    if (result.errors && result.errors.length) {

        // if catch is on, fall back on default or undefined
        if (rule.catch)  {
            return rule.default;
        }

        throw new error.FieldValidationError(result.errors[0].message);
    }
    return value;
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

    return function validateCb(obj, callback) {
        var val = obj;
        var err = null;

        try {
            val = validate(obj);
        } catch (e) {
            err = e;
        } finally {
            setImmediate(callback, err, val);
        }
    };
}

/**
 * Returns a validation function that returns a promise
 * @param {Object} schema
 * @return {Function}
 */
function promiseWrapper(schema) {
    var validate = vlad(schema);

    return function validateAsync(obj) {
        return Promise.try(function() {
            return validate(obj);
        });
    }
}

/**
 * Returns a express middleware validator
 * @param {String} prop - e.g. 'query', 'body', 'params', 'path', 'method'
 * @param {Object} schema
 * @return {Function} - middleware
 */
function middlewareWrapper(prop, schema) {
    if (schema === undefined) {
        schema = prop;
        prop = 'query';
    }

    var validate = vlad(schema);

    return function validateMiddleware(req, res, next) {
        var err = null;

        try {
            req[prop] = validate(req[prop]);
        } catch(e) {
            err = e;
        } finally {
            setImmediate(next, err);
        }
    };
}
