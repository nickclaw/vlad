var _ = require('lodash');

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
}

/**
 * Define a bunch of properties at once
 * @param {*} ctx
 * @param {Object} getters
 */
function defineProperties(ctx, getters) {
    _.each(getters, function(getter, name) {
        defineProperty(ctx, name, getter);
    });
}

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

module.exports = {
    defineProperty: defineProperty,
    defineProperties: defineProperties,
    keyMap: keyMap
}
