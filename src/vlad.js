import isPlainObject from 'lodash/isPlainObject';
import { Property } from './property';
import { resolveFunction, resolveProperty, resolveObject } from './resolve';
import * as types from './types';
import * as error from './errors';
import { defineGetters, defineProperty } from './util';

export default function vlad(rule) {

    if (typeof rule === 'function') {
        return function vladidateFunction(value, callback) {
            resolveFunction(rule, value, callback);
        }
    }

    if (rule instanceof Property) {
        const schema = rule.toSchema();
        return function vladidateProperty(value, callback) {
            resolveProperty(rule, schema, value, callback);
        }
    }

    if (isPlainObject(rule)) {
        const object = transform((obj, v, k) => obj[k] = vlad(v), {});

        return function vladidateObject(value, callback) {
            resolveObject(object, value, callback);
        }
    }

    throw new error.SchemaFormatError('Invalid schema.', rule);
}

vlad.callback = vlad;

vlad.promise = function vladAync(rule) {
    const validator = vlad(rule);

    return function vladidateAsync(val) {
        return new Promise((res, rej) => {
            validator(val, (err, v) => {
                if (err) rej(err);
                else res(v);
            });
        })
    }
}

vlad.middleware = function vladMiddleware(_type, _rule) {
    const type = _rule === undefined ? 'query' : _type;
    const rule = _rule === undefined ? _type : _rule;
    const validator = vlad(rule);

    return function vladidateMiddleware(req, res, next) {
        validator(req[type], (err, v) => {
            if (err) return next(err);
            req[type] = v;
            next();
        });
    }
}

vlad.sync = function vladSync(rule) {
    const validator = vlad(rule);
    // TODO
}

defineGetters(vlad, {
    string: types.string,
    number: types.number,
    integer: types.integer,
    array: types.array,
    boolean: types.boolean,
    date: types.date,
    any: function() {
        return property.extend();
    }
});

/**
 * Add a custom validator to vlad
 * @param {String} name
 * @param {Function|Property} validator
 * @return {vlad}
 */
vlad.use = function(name, validator) {
    // case: Property
    if (validator instanceof Property)
        defineProperty(vlad, name, validator.extend.bind(validator));

    // case: Function
    else if (typeof validator === 'function')
        defineProperty(vlad, name, function() {
            return validator
        });

    else throw error.SchemaFormatError('Could not add `' + name + '` validator, not an instance of Property or Function.');

    return vlad;
};

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
 * validator for forcing a value to equal something
 * only does a shallow comparison, so will not work on objects
 *
 * @param {*} value
 * @param {String?} message - optional error message
 * @return {Property}
 */
vlad.equals = function(value, message) {
    var prop = new Property();
    prop.validate = function(val, callback) {
        if (value !== val) {
            return callback(error.FieldValidationError(message || (val + ' does not equal ' + value + '.')));
        } else {
            return callback(null, val);
        }
    };
    return prop;
};

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
