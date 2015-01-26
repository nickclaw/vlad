vlad ![](https://travis-ci.org/nickclaw/vlad.svg)
------------------
JSON schema validation with a chainable promise based syntax.

```javascript
var validate = vlad({
    name: vlad.string.required,
    age: vlad.integer.default(18),
    email: vlad.string.format('email'),

    location: vlad({
        long: vlad.number.required.within(-180, 180),
        lat: vlad.number.required.within(-90, 90)
    })
});

validate(obj).then(
    function(value) {
        /*{
            name: "John Doe",
            age: 20,
            location: {
                long: 70.235,
                lat: 60.234
            }
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
                }
            }
        }*/
    }
);
```

# API

#### `vlad(schema)`
Takes in a property or object of properties, returns a validating function.

This function takes in a value or object and returns a promise that either is resolved with the value (defaults added) or rejected with the corresponding error.

These validation functions can be used in lieu of a Property, making it easy to validate nested objects (see example above).

#### `vlad.addFormat(name, handler)`
Lets you add in special string formats using more complex validation than regexes. The handler function gets the current value and returns the error string if there was an error.

## Property Types

#### String type `vlad.string`
 * `vlad.string.maxLength(length)`
 * `vlad.string.minLength(length)`
 * `vlad.string.pattern(regex)`
 * `vlad.string.format(format)` - format name
   * `date` (YYYY-MM-DD)
   * `date-time` (for example, 2014-05-02T12:59:29+00:00)
   * `email`
   * `uri`
   * `url`
   * `credit-card-number`
   * `duration` (for example, P1DT12H for 1.5 days)
 * `vlad.string.within(maxLength, minLength)`

#### Number types `vlad.number` / `vlad.integer`
 * `vlad.number.multipleOf(value)`
 * `vlad.number.max(max)`
 * `vlad.number.min(min)`
 * `vlad.number.within(min, max)`

#### Enum `vlad.enum(options, default)`
 * `options` - array of possible values
 * `default` - optional value to default to

## Errors

#### `vlad.FieldValidationError`
 * message

#### `vlad.GroupValidationError`
 * message
 * fields (object of FieldValidationErrors)
