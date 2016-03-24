import * as e from '../errors';
import { Property } from '../property';
import { defineSetters } from '../util';

export class _Array extends Property {

    _type = 'array';

    of(validator) {
        if (validator instanceof Property) {
            this._validator = require('../vlad')(validator);
        } else if (typeof validator === 'function') {
            this._validator = validator;
        } else {
            throw e.SchemaFormatError('array.of(validator) must be passed a vlad property or function.');
        }
    }

    validate(array) {
        if (!Array.isArray(array))
            throw e.FieldValidationError('Not an array.');

        if (this._min !== undefined && array.length < this._min)
            throw e.FieldValidationError('Array too short.');

        if (this._max !== undefined && array.length > this._max)
            throw e.FieldValidationError('Array too long.');

        var validator = this._validator || Promise.resolve;

        return Promise.settle(array.map(validator))
            .then(function(results) {
                var errored = false,
                    success = [],
                    errors = [];

                results.forEach(function(result, i) {
                    if (result.isRejected()) {
                        errored = true;
                        errors[i] = result.reason();
                    } else {
                        success[i] = result.value();
                    }
                });

                return errored ?
                    Promise.reject(new e.ArrayValidationError('Invalid array items', errors)) :
                    Promise.resolve(array);
            });
    }


    //
    // Setters
    //
    min(min) {
        this._min = min;
        return this;
    }
    minLength(min) { return this.min(min); }

    max(max) {
        this._max = max;
        return this
    }
    maxLength(max) { return this.max(max); }
}

export default function createArray() {
    return new _Array();
}
