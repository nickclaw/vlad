import * as e from '../errors';
import { Property } from '../property';

export class Boolean extends Property {
    _type = 'boolean';

    parse(value) {
        switch(typeof value) {
            case 'boolean': return value;
            case 'string':
                if (value === 'true') return true;
                if (value === 'false') return false;
                break;
            default: throw new e.FieldValidationError(value + ' is not true or false.');
        }
    }

    validate(value) {
        if (typeof value !== 'boolean')
            throw e.FieldValidationError('Not true or false.');

        return value;
    }
}

export default function createBoolean() {
    return new Boolean();
}
