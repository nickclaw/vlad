var util = require('./util');

function Property() {}

/**
 * Generates jsonschema object from property
 * @return {Object}
 */
Property.prototype.toSchema = function toSchema() {
    return util.keyMap(this, function(value, key) {
        if (key.indexOf('_') === 0) return key.slice(1);
    });
};

/**
 * Return an object with this as a prototype
 * @return {Object}
 */
Property.prototype.extend = function extend() {
    return Object.create(this);
};

/**
 * Attempts to parse the object
 * @param {*} val
 * @return {*} - parsed val
 */
Property.prototype.parse = function(val) {
    return val;
};

/**
 * Validates the object
 * Only implemented by properties that want to overwrite tv4 validation
 * @param {Value}
 * @returns {Promise}
 */
Property.prototype.validate = null;


//
// Base value setters
//
util.defineSetters(Property.prototype, {

    /**
     * Sets the default value of the property
     * @param {*} value
     */
    default: function(value) {
        this._default = value;
        this._required = false;
    }
});


//
// Base flag setters
//
util.defineGetters(Property.prototype, {

    /**
     * Force the property to be required
     */
    required: function() {
        this._required = this._default === undefined;
    },

    /**
     * Catch validation errors
     * Will set value to whatever the default value is set to,
     * even if that is undefined
     */
    catch: function() {
        this._catch = true;
    },

    // chainables
    and: util.noop,
    has: util.noop
});

module.exports = new Property();
module.exports.Property = Property;
