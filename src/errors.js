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

ValidationError.prototype.toJSON = function() {

    if (this.fields) {
        return reduce(this.fields, function(memo, field, key) {
            memo[key] = field.toJSON();
            return memo;
        }, {});
    }

    return this.message;
};



function reduce(obj, fn, memo) {
    for (var key in obj) {
        memo = fn(memo, obj[key], key);
    }
    return memo;
}
