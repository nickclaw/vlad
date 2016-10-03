var e = require('../errors'),
    util = require('../util'),
    property = require('../property');

var obj = property.extend();
obj._type = 'object';

obj.validate = function(obj) {
  if (typeof obj !== 'object') throw new e.FieldValidationError("Not an object.");
  if (!obj) throw new e.FieldValidationError("Not an object.");
  return obj;
}

module.exports = function createObj() {
    return obj.extend();
}
module.exports.property = obj;
