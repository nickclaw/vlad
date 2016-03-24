import { Property } from '../property';
import { defineSetters } from '../util';

export class String extends Property {
    _type = 'string';

    // aliases
    maxLength(length) {
        this._maxLength = length;
        return this;
    }
    max(length) {
        this._maxLength = length;
        return this;
    }

    // aliases
    minLength(length) {
        this._minLength = length;
        return this;
    }
    min(length) {
        this._minLength = length;
        return this;
    }

    pattern(pattern) {
        this._pattern = pattern;
        return this;
    }

    format(format) {
        this._format = format;
        return this;
    }

    within(min, max) {
        this._minLength = min;
        this._maxLength = max;
        return this;
    }
}

export default function createString() {
    return new String();
};
