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
}

/**
 * Return an object with this as a prototype
 * @return {Object}
 */
Property.prototype.extend = function extend() {
    return Object.create(this);
}


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
})


//
// Base flag setters
//
util.defineGetters(Property.prototype, {

    /**
     * Force the property to be required
     */
    required: function() {
        this._required = this._default === undefined
    },

    /**
     * Throw error if invalid value is passed
     * instead of passing error
     */
    strict: function() {
        this._strict = true;
    }
});

module.exports = new Property();
module.exports.Property = Property;
