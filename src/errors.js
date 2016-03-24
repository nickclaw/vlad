import transform from 'lodash/transform';

function toJSON(err) {
    return err.toJSON ?
        err.toJSON() :
        (err.message || 'Error');
}

export class ValidationError extends Error {
    static fromJSON(json) {
        if (typeof json === 'string') {
            return FieldValidationError.fromJSON(json); // eslint-disable-line no-use-before-define
        }

        if (Array.isArray(json)) {
            return ArrayValidationError.fromJSON(json); // eslint-disable-line no-use-before-define
        }

        return GroupValidationError.fromJSON(json); // eslint-disable-line no-use-before-define
    }

    toJSON() {
        return this.message;
    }
}


export class FieldValidationError extends ValidationError {
    static fromJSON(json) {
        return new FieldValidationError(json);
    };
}


export class GroupValidationError extends ValidationError {
    static fromJSON(json) {
        return GroupValidationError('Invalid object.', transform(json, (memo, value, key) => {
            memo[key] = ValidationError.fromJSON(value);
        }, {}));
    };

    constructor(message, fields) {
        super(message);
        this.fields = fields;
    }

    toJSON() {
        return reduce(this.fields, function(memo, value, key) {
            memo[key] = toJSON(value);
            return memo;
        }, {});
    }
}


export class ArrayValidationError extends GroupValidationError {
    static fromJSON(json) {
        return ArrayValidationError('Invalid array.', json.map(function(value) {
            return value && ValidationError.fromJSON(value);
        }));
    };

    toJSON() {
        return this.fields.map(function(value) {
            if (value) return toJSON(value);
        });
    }
}
