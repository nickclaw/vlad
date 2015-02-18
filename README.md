vlad ![](https://travis-ci.org/nickclaw/vlad.svg)
------------------
A simple asynchronous JSON validator with a chainable syntax.

```javascript
var validate = vlad({
    name: vlad.string.required,
    age: vlad.integer.default(18),
    email: vlad.string.format('email'),

    location: vlad({
        long: vlad.number.required.within(-180, 180),
        lat: vlad.number.required.within(-90, 90)
    }),

    property: vlad(customAsyncFunction)
});

validate(obj).then(
    function(value) {
        /*{
            name: "John Doe",
            age: 20,
            location: {
                long: 70.235,
                lat: 60.234
            },

            property: true
        }*/
    },
    function(err) {
        /* GroupValidationError {
            message: "Invalid object",
            fields: {
                name: FieldValidationError {message: '...'},
                email: FieldValidationError {message: '...'},
                location: GroupValidationError {
                    message: 'Invalid object',
                    fields: {
                        long: FieldValidationError {message: '...'}
                    }
                },
                property: FieldValidationError {message: '...'}
            }
        }*/
    }
);
```

# API

#### `vlad(schema)` or `vlad.promise(schema)`
A schema is a property, custom validation function, or an object of schema.

```javascript
// validate with a property
var validatePropertyFn = vlad(vlad.string);

// validate with a sync/async custom function
var validateCustomFn = vlad(function(val) {
    // do custom validation
    // return promise OR
    // throw Error/return val
});

// validate an object of keys
var validateObjectFn = vlad({
    a: vlad.integer,
    b: validateCustomFn
});
```

#### `vlad.callback(schema)`
Returns a validation function that takes in a callback as asecond argument rather
then returning a promise.

```javascript
var validate = vlad.callback(schema);
validate(obj, function(err, value) {
    // do stuff
});
```

#### `vlad.middleware(schema, prop)`
Returns a validation function that can be used as a connect middleware.
By default the validation function will attempt to validate req.query,
but you can change that by passing in a property name to use for (e.g. body, param).

```javascript
var validate = vlad.middleware(schema);
router.get('/path', validate, function(req, res) {
    // handle req[prop]
});

// ...

router.use(function(err, req, res, next) {
    // handle 'err'
});
```

#### `vlad.addFormat(name, handler)`
Lets you add in special string formats using more complex validation than regexes. The handler function gets the current value and returns the error string if there was an error.

## Property Types

#### Base type
* `property.default(value)` - value to default to (default value skips validation)
* `property.catch` - catch all validation errors by making value equal to default (even if undefined)

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
 var subType = vlad(vlad.string);
 var validator = vlad(vlad.array.of(subType));
 ```

#### Boolean `vlad.boolean`
 * no special options

#### Date `vlad.date`
Will attempt to convert all values to a Date object

#### Enum `vlad.enum(options)`
 * `options` - array of possible values

#### Equals `vlad.equals(value, message)`
 * `value` - value it must equal
 * `message` - optional error message

## Errors

#### `vlad.FieldValidationError`
 * message

#### `vlad.GroupValidationError`
 * message
 * fields (object of FieldValidationErrors)

### `vlad.ArrayValidationError`
 * message
 * fields (object of FieldValidationErrors)
