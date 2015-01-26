var errorFactory = require('error-factory');

module.exports.FieldValidationError =
errorFactory('FieldValidationError', ['message']);

module.exports.GroupValidationError =
errorFactory('GroupValidationError', ['message', 'fields']);

module.exports.ArrayValidationError =
errorFactory('ArrayValidationError', ['message', 'fields']);
