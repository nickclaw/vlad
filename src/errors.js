var errorFactory = require('error-factory');

var ValidationError = errorFactory('ValidationError', ['message']);
var FieldValidationError = errorFactory('FieldValidationError', ['message'], ValidationError);
var GroupValidationError = errorFactory('GroupValidationError', ['message', 'fields'], ValidationError);
var ArrayValidationError = errorFactory('ArrayValidationError', ['message', 'fields'], GroupValidationError);
var SchemaFormatError = errorFactory('SchemeFormatError', ['message']);
var SyncValidationError = errorFactory('SyncValidationError', ['message']);

module.exports = {
    ValidationError: ValidationError,
    SyncValidationError: SyncValidationError,
    FieldValidationError: FieldValidationError,
    GroupValidationError: GroupValidationError,
    ArrayValidationError: ArrayValidationError,
    SchemaFormatError: SchemaFormatError
};

//
// serialization
//

ValidationError.prototype.toJSON = function() {
    return this.message; // works for FieldValidationError as well
};

GroupValidationError.prototype.toJSON = function() {
    return reduce(this.fields, function(memo, value, key) {
        memo[key] = value.toJSON();
        return memo;
    }, {});
}

ArrayValidationError.prototype.toJSON = function() {
    return this.fields.map(function(value) {
        if (value) return value.toJSON();
    });
}

//
// deserialization
//

ValidationError.fromJSON = function fromJSON(json) {
    if (typeof json === "string") {
        return new FieldValidationError(json);
    } else if (Array.isArray(json)) {
        return new ArrayValidationError.fromJSON(json);
    } else {
        return GroupValidationError.fromJSON(json);
    }
};

FieldValidationError.fromJSON = function fromJSON(json) {
    return FieldValidationError(json);
};

GroupValidationError.fromJSON = function fromJSON(json) {
    return GroupValidationError("Invalid object.", reduce(json, function(memo, value, key) {
        memo[key] = ValidationError.fromJSON(value);
        return memo;
    }, {}))
};

ArrayValidationError.fromJSON = function fromJSON(json) {
    return ArrayValidationError("Invalid array.", json.map(function(value) {
        return value && ValidationError.fromJSON(value);
    }));
};

//
// Util
//

function reduce(obj, fn, memo) {
    for (var key in obj) {
        memo = fn(memo, obj[key], key);
    }
    return memo;
}
