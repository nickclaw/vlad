import * as e from '../errors';
import { Property } from '../property';

export class _Date extends Property {
    _type = 'date';

    parse(date) {
        if ( !(date instanceof Date) ) {
            date = new Date(date);
        }
        if (date.getTime() !== date.getTime()) return NaN;
        return date;
    }

    validate(date) {
        if (date !== date) throw e.FieldValidationError('Not a valid date.');
        return date;
    }
}

export default function createDate() {
    return new _Date();
}
