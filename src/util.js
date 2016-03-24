import each from 'lodash/each';

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
export function defineGetters(ctx, getters) {
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
export function defineSetters(ctx, setters) {
    each(setters, function(setter, name) {
        ctx[name] = function() {
            var result = setter.apply(this, arguments);
            return result === undefined ? this : result;
        };

        // for debugging
        ctx[name].displayName = name;
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
export function keyMap(ctx, fn) {
    var obj = {};
    for(let key in ctx) {
        var value = ctx[key],
            newKey = fn(value, key);

        if (newKey !== undefined) obj[newKey] = value;
    }
    return obj;
}
