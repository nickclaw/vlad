var e = require('../errors'),
    Promise = require('bluebird'),
    util = require('../util'),
    property = require('../property');

var date = property.extend();
date._type = 'date';

date.parse = function(date) {
    if ( !(date instanceof Date) ) {
        date = new Date(date);
    }
    if (date.getTime() !== date.getTime()) return NaN;
    return date;
}

date.validate = function(date) {
    return new Promise(function(res, rej) {
        if (date !== date) return rej(new e.FieldValidationError("Not a valid date."));
        res(date);
    });
}

module.exports = function createDate() {
    return date.extend();
}
module.exports.property = date;
