var util = require('./util');

var property = {

    /**
     * Generates a valid jsonschema object from the property
     * @return {Object}
     */
    toSchema: function() {
        return util.keyMap(this, function(value, key) {
            if (key.indexOf('_') === 0) return key.slice(1);
        });
    },

    /**
     * Returns an object that extends this object
     * @return {Object}
     */
    extend: function() {
        return Object.create(this);
    }
};


//
// Base value setters
//
util.defineSetters(property, {

    /**
     * Sets the default value of the property
     * @param {*} value
     */
    default: function(value) {
        this._default = value;
        this._required = false;
        return this;
    }
})


//
// Base flag setters
//
util.defineGetters(property, {

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

module.exports = property;
