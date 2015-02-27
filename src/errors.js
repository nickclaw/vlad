function extendError(name, fields, ParentError) {
    var CustomError = function() {
        ParentError.apply(this, arguments);
        this.name = name;
        for (var i = 0; i < fields.length; i++) {
            this[fields[i]] = arguments[i];
        }
    };
    CustomError.prototype = new ParentError();
    CustomError.name = name;
    return CustomError;
}

module.exports.ValidationError =
extendError('ValidationError', ['message'], Error);

module.exports.ValidationError.prototype.toJSON = function() {

    if (this.fields) {
        return reduce(this.fields, function(memo, field, key) {
            memo[key] = field.toJSON();
            return memo;
        }, {});
    }

    return this.message;
};

module.exports.FieldValidationError =
extendError('FieldValidationError', [], module.exports.ValidationError);

module.exports.GroupValidationError =
extendError('GroupValidationError', ['message', 'fields'], module.exports.ValidationError);

module.exports.ArrayValidationError =
extendError('ArrayValidationError', [], module.exports.GroupValidationError);

module.exports.SchemaFormatError =
extendError('SchemaFormatError', ['message'], Error);

function reduce(obj, fn, memo) {
    for (var key in obj) {
        memo = fn(memo, obj[key], key);
    }
    return memo;
}
