vlad ![](https://travis-ci.org/nickclaw/vlad.svg)
------------------
A simple asynchronous JSON validator with a chainable syntax.

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
validate.location.longitude(long).then(/* */);

```

# API

#### `vlad(schema)` or `vlad.promise(schema)`
A schema is a property, custom validation function, or an object of schema. __Has subvalidators!__

```javascript
// validate with a property
var validatePropertyFn = vlad(vlad.string);

// validate with a sync/async custom function
var validateCustomFn = vlad(function(val) {
    // do custom validation
    // return promise OR
    // throw Error/return validated value
});

// validate an object of keys
var validateObjectFn = vlad({
    a: vlad.integer,
    b: validateCustomFn,
    c: vlad({
        d: vlad.string
    })
});

validateObjectFn.c.d // exists
```

#### `vlad.callback(schema)`
Returns a validation function that takes in a callback as a second argument rather then returning a promise. __No subvalidators!__

```javascript
var validate = vlad.callback(schema);
validate(obj, function(err, value) {
    // do stuff
});
```

#### `vlad.middleware([prop='query',] schema)`
Returns a validation function that can be used as a connect middleware.
By default the validation function will attempt to validate req.query,
but you can change that by passing in a property name to use for (e.g. body, param). __No subvalidators!__

```javascript
var validate = vlad.middleware('query', schema);
router.get('/path', validate, function(req, res) {
    // handle req.query
});

// ...

router.use(function(err, req, res, next) {
    // handle 'err'
});
```

#### `vlad.addFormat(name, handler)`
Lets you add in special string formats using more complex validation than regexes. The handler function gets the current value and returns the error string if there was an error.

## Property Types

#### Base type (inherited by all other types)
* `property.default(value)` - value to default to (default value skips validation)
* `property.required` - force this value to not be `undefined`. Will fallback to default value if default value is set.
* `property.catch` - catch all validation errors by making value equal to default (even if `undefined`)
* `property.is`, `property.has`, `property.and` - filler words

#### String type `vlad.string`
 * `vlad.string.maxLength(length)` (or `.max(length)`)
 * `vlad.string.minLength(length)` (or `.min(length)`)
 * `vlad.string.within(min, max)`
 * `vlad.string.pattern(regex)`
 * `vlad.string.format(format)` - from formats added by `vlad.addFormat`

#### Number types `vlad.number` / `vlad.integer`
 * `vlad.number.multipleOf(value)`
 * `vlad.number.max(max)`
 * `vlad.number.min(min)`
 * `vlad.number.within(min, max)`

#### Array `vlad.array`
 * `vlad.array.min(length)` (or `.minLength(length)`)
 * `vlad.array.max(length)` (or `.maxLength(length)`)
 * `vlad.array.of(validator)`
 ```javascript
 var subType = vlad(vlad.string); // or just `vlad.string`
 var validator = vlad(vlad.array.of(subType));
 ```

#### Boolean `vlad.boolean`
 * no special options
 * will automatically parse `"true"` and `"false"`

#### Date `vlad.date`
Will attempt to convert all values to a Date object

#### Any `vlad.any`
Matches any data type.

#### Enum `vlad.enum(options)`
 * `options` - array of possible values

#### Equals `vlad.equals(value, message)`
 * `value` - value it must equal
 * `message` - optional error message

## Errors

#### `vlad.ValidationError`
 * message
 * `error.toJSON()` - returns a nice JSON representation of error.

#### `vlad.FieldValidationError`
 * message

#### `vlad.GroupValidationError`
 * message
 * fields (object of FieldValidationErrors)

### `vlad.ArrayValidationError`
 * message
 * fields (object of FieldValidationErrors)
