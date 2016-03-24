import { keyMap } from './util';

export class Property {

    toSchema() {
        return keyMap(this, function(value, key) {
            if (key.indexOf('_') === 0) return key.slice(1);
        });
    }

    extend() {
        return Object.create(this);
    }

    default(value) {
        this._default = value;
        this._required = false;
        return this;
    }

    get required() {
        this._required = this._default === undefined;
        return this;
    }

    get catch() {
        this._catch = true;
        return this;
    }

    get and() { return this; }
    get has() { return this; }
    get is() { return this; }
    get it() { return this; }
}
