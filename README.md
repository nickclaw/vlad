vlad ![](https://travis-ci.org/nickclaw/vlad.svg)
------------------
A simple asynchronous JSON validator with a chainable syntax.

    npm install vlad

### Example

```javascript
var validate = vlad({
    email: vlad.string,
    location: vlad({
        long: vlad.number.required.within(-180, 180),
        lat: vlad.number.required.within(-90, 90)
    })
});

//
// Validate objects!
//

validate(validObject).then(function(value) {
    /*{
        email: "me@example.com",
        location: {
            long: 70.235,
            lat: 60.234
        }
    }*/
});

validate(invalidObject).catch(function(err) {
    /* GroupValidationError {
        message: "Invalid object",
        fields: {
            email: FieldValidationError {message: '...'},
            location: GroupValidationError {
                message: 'Invalid object',
                fields: {
                    long: FieldValidationError {message: '...'}
                }
            }
        }
    }*/
});

//
// Subvalidators!
//

validate.email(email).then(/* */);
validate.location(loc).then(/* */);
validate.location.long(longitude).then(/* */);

```

## API Reference
- [Creation](API.md#creation)
    - [`vlad(schema)`](API.md#vladschema---functionvalue)
    - [`vlad.promise(schema)`](API.md#vladpromiseschema---functionvalue)
    - [`vlad.callback(schema)`](API.md#vladcallbackschema---functionvalue-callback)
    - [`vlad.middleware([prop, ] schema)`](API.md#vladmiddlewareprop-schema---function-req-res-next)
- [Validation](API.md#validation)
    - [Subvalidators](API.md#subvalidators)
- [Schema](API.md#schema)
    - [Property](API.md#property)
    - [Function](API.md#function)
    - [Object](API.md#object)
- [Property Types](API.md#property-types)
    - [Base Property](API.md#base-property)
    - [`vlad.string`](API.md#vladstring)
        - [`vlad.addFormat(name, handler)`](API.md#vladaddformatname-handler)
    - [`vlad.number`](API.md#vladnumber)
    - [`vlad.integer`](API.md#vladinteger)
    - [`vlad.boolean`](API.md#vladboolean)
    - [`vlad.date`](API.md#vladdate)
    - [`vlad.array`](API.md#vladarray)
    - [`vlad.enum(options)`](API.md#vladenumoptions)
    - [`vlad.equals(value [, message])`](API.md#vladequalsvalue--message)
    - [`vlad.any`](API.md#vladany)
- [Errors](API.md#errors)
    - [`vlad.ValidationError(message)`](API.md#vladvalidationerrormessage)
    - [`vlad.FieldValidationError(message)`](API.md#vladfieldvalidationerrormessage)
    - [`vlad.GroupValidationError(message, fields)`](API.md#vladgroupvalidationerrormessage-fields)
    - [`vlad.ArrayValidationError(message, fields)`](API.md#vladarrayvalidationerrormessage-fields)
    - [`vlad.SchemaFormatError(message)`](API.md#vladschemaformaterrormessage)
