vlad [![Build Status](https://travis-ci.org/nickclaw/vlad.svg?branch=master)](https://travis-ci.org/nickclaw/vlad)
------------------
A simple asynchronous JSON validator with a chainable syntax.

    npm install vlad

### Example

#### Object Validation
```javascript
var validate = vlad({
    email: vlad.string,
    location: vlad({
        long: vlad.number.required.within(-180, 180),
        lat: vlad.number.required.within(-90, 90)
    }),

    tags: vlad.array.of(vlad.string.within(3, 10))
});

validate(validObject).then(function(value) {
    /*{
        email: "me@example.com",
        location: {
            long: 70.235,
            lat: 60.234
        },
        tags: ['foo', 'bar']
    }*/
});


validate(invalidObject).catch(function(err) {
    /* GroupValidationError {
        message: "Invalid object.",
        fields: {
            email: FieldValidationError {message: '...'},
            location: GroupValidationError {
                message: 'Invalid object.',
                fields: {
                    long: FieldValidationError {message: '...'}
                }
            },
            tags: ArrayValidationError {
                message: 'Invalid array.',
                fields: [
                    undefined,
                    FieldValidationError {message: '...'},
                    undefined
                ]
            }
        }
    }*/
});
```

#### Express Middleware
```javascript
router.post('/',
    vlad.middleware('body', {
        email: vlad.string.required.pattern(/.*@.*/)
    }),
    function(req, res) {
        res.send(200);
    }
);

router.use(function(err, req, res, next) {
    if (err instanceof vlad.ValidationError) {
        res.status(400).send(err.toJSON());
    } else {
        res.sendStatus(500);
    }
});

```

#### Subvalidators
```javascript
var validate = vlad({
    field: vlad.string.required
});

validate({ field: 'hello world' }).then( /* handle */ );
validate.field('hello world').then( /* handle */ )
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
