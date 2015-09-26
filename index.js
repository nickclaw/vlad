var vlad = module.exports = require('./src/vlad');
module.exports.vlad = vlad;
module.exports.util = require('./src/util');
module.exports.property = require('./src/property');

var errors = require('./src/errors');
module.exports.ValidationError = errors.ValidationError;
module.exports.FieldValidationError = errors.FieldValidationError;
module.exports.GroupValidationError = errors.GroupValidationError;
module.exports.ArrayValidationError = errors.ArrayValidationError;
module.exports.SchemaFormatError = errors.SchemaFormatError;
