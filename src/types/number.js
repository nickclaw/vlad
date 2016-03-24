import * as e from '../errors';
import { Property } from '../property';
import { defineGetters, defineSetters } from '../util';

export class Number extends Property {
    _type = 'number';

    parse(val) {
        var n = parseFloat(val);
        if (n !== n) throw new e.FieldValidationError(val + ' is not a number.');
        return n;
    }

    multipleOf(value) {
        this._multipleOf = value;
        return this;
    }

    max(max) {
        this._maximum = max;
        return this;
    }

    min(min) {
        this._minimum = min;
        return this;
    }

    within(min, max) {
        this._minimum = min;
        this._maximum = max;
        return this;
    }

    get exclusive() {
        this._exclusiveMaximum = true;
        this._exclusiveMinimum = true;
        return this;
    }
}

export default function createNumber() {
    return new Number();
}
