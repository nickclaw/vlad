var util = require('./util');

//
// Base value setters
//
var property = {

    /**
     * Sets the default value of the property
     * @param {*} value
     */
    default: function(value) {
        this._default = value;
        this._required = false;
        return this;
    },

    /**
     * Generates a valid jsonschema object from the property
     * @return {Object}
     */
    toSchema: function() {
        return util.keyMap(this, function(value, key) {
            if (key.indexOf('_') === 0) return key.slice(1);
        });
    }
};


//
// Base flag setters
//
util.defineProperties(property, {

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
    },

    extend: function() {
        return Object.create(this);
    }
});

module.exports = property;
