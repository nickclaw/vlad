function ValidationError(message) {
    if (!(this instanceof Error)) return new ValidationError(message);
    this.name = 'ValidationError';
    this.message = message;
    this.stack = (new Error()).stack;
}
ValidationError.prototype = new Error();

function FieldValidationError(message) {
    if (!(this instanceof Error)) return new FieldValidationError(message);
    this.name = 'FieldValidationError';
    this.message = message;
    this.stack = (new Error()).stack;
}
FieldValidationError.prototype = new ValidationError();

function GroupValidationError(message, fields) {
    if (!(this instanceof Error)) return new GroupValidationError(message, fields);
    this.name = 'GroupValidationError';
    this.message = message;
    this.fields = fields;
    this.stack = (new Error()).stack;
}
GroupValidationError.prototype = new ValidationError();

function ArrayValidationError(message, fields) {
    if (!(this instanceof Error)) return new ArrayValidationError(message, fields);
    this.name = 'ArrayValidationError';
    this.message = message;
    this.fields = fields;
    this.stack = (new Error()).stack;
}
ArrayValidationError.prototype = new GroupValidationError();

function SchemaFormatError(message) {
    if (!(this instanceof Error)) return new SchemaFormatError(message);
    this.name = 'SchemaFormatError';
    this.message = message;
    this.stack = (new Error()).stack;
}
SchemaFormatError.prototype = new Error();

module.exports = {
    ValidationError: ValidationError,
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
        memo[key] = toJSON(value);
        return memo;
    }, {});
}

ArrayValidationError.prototype.toJSON = function() {
    return this.fields.map(function(value) {
        if (value) return toJSON(value);
    });
}

function toJSON(err) {
    return err.toJSON ? err.toJSON() : ( err.message || "Error" );
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
