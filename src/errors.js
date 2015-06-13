var errorFactory = require('error-factory');

var ValidationError = errorFactory('ValidationError', ['message']);
var FieldValidationError = errorFactory('FieldValidationError', ['message'], ValidationError);
var GroupValidationError = errorFactory('GroupValidationError', ['message', 'fields'], ValidationError);
var ArrayValidationError = errorFactory('ArrayValidationError', ['message', 'fields'], GroupValidationError);
var SchemaFormatError = errorFactory('ValidationError', ['message']);

module.exports = {
    ValidationError: ValidationError,
    FieldValidationError: FieldValidationError,
    GroupValidationError: GroupValidationError,
    ArrayValidationError: ArrayValidationError,
    SchemaFormatError: SchemaFormatError
};

//
// (de)serialization
//

ValidationError.prototype.toJSON = function() {

    if (this.fields) {
        return reduce(this.fields, function(memo, field, key) {
            memo[key] = field.toJSON();
            return memo;
        }, {});
    }

    return this.message;
};

ValidationError.fromJSON = function fromJSON(json) {
    if (typeof json === "string") {
        return new FieldValidationError(json);
    } else {
        return GroupValidationError.fromJSON(json);
    }
};

FieldValidationError.fromJSON = function fromJSON(json) {
    return FieldValidationError(json);
}

ArrayValidationError.fromJSON =
GroupValidationError.fromJSON = function fromJSON(json) {
    return GroupValidationError("Invalid object.", reduce(json, function(memo, value, key) {
        memo[key] = ValidationError.fromJSON(value);
        return memo;
    }, {}))
}

//
// Util
//

function reduce(obj, fn, memo) {
    for (var key in obj) {
        memo = fn(memo, obj[key], key);
    }
    return memo;
}
