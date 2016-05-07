var error = require('./errors');

/**
 * A property definer, used for chained syntax
 * Borrowed from chai.js
 *
 * @param {*} ctx
 * @param {String} name
 * @param {Function} getter
 */
function defineProperty(ctx, name, getter) {
    Object.defineProperty(ctx, name, {
        get: function() {
            var result = getter.call(this);
            return result === undefined ? this : result;
        },
        configurable: true
    });
    return ctx;
}

/**
 * Define a bunch of properties at once using the getter syntax
 * @param {*} ctx
 * @param {Object} getters
 * @param ctx
 */
function defineGetters(ctx, getters) {
    each(getters, function(getter, name) {
        defineProperty(ctx, name, getter);
    });
    return ctx;
}

/**
 * Define a bunch of properties at once using the setter syntax
 * @param {*} ctx
 * @param {Object} getters
 * @return ctx
 */
function defineSetters(ctx, setters) {
    each(setters, function(setter, name) {
        ctx[name] = function() {
            var result = setter.apply(this, arguments);
            return result === undefined ? this : result;
        };

        // for debugging
        ctx[name].name = ctx[name].displayname = name;
    });
    return ctx;
};

/**
 * Map an objects keys while maintaining values
 * If returned value is undefined, does not add key/value pair
 *
 * @param {Object} ctx
 * @param {Function} fn
 * @return {Object}
 */
function keyMap(ctx, fn) {
    var obj = {};
    for(key in ctx) {
        var value = ctx[key],
            newKey = fn(value, key);

        if (newKey !== undefined) obj[newKey] = value;
    }
    return obj;
}

function reduce(obj, fn, memo) {
    for (var key in obj) {
        memo = fn(memo, obj[key], key);
    }
    return memo;
}

function each(obj, fn) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            fn(obj[key], key);
        }
    }
}

function values(obj) {
    return reduce(obj, function(memo, val) {
        memo.push(val);
        return memo;
    }, []);
}

function extend(obj) {
    for (var i = 1; i < arguments.length; i++) {
        each(arguments[i], apply);
    }
    return obj;

    function apply(value, key) {
        obj[key] = value;
    }
}

/**
 * Checks for plain object
 * @param {*} obj
 * @return {Boolean}
 */
function isObject(obj) {
    return Object.prototype.toString.call( obj ) === "[object Object]";
}

function tryFunction(fn, arg) {
    try {
        return fn(arg);
    } catch (e) {
        if (e instanceof error.ValidationError) throw e;
        throw new error.FieldValidationError(e.message);
    }
}


module.exports = {
    defineProperty: defineProperty,
    defineGetters: defineGetters,
    defineSetters: defineSetters,
    keyMap: keyMap,
    isObject: isObject,
    tryFunction: tryFunction,
    noop: function(){},

    // lodash replacements
    reduce: reduce,
    each: each,
    extend: extend
};
