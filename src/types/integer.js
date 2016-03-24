import { Number } from './number';

export class Integer extends Number {
    _type = 'integer';
}

export default function createInteger() {
    return new Integer();
}
