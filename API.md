# API Reference

- [Creation](#creation)
    - [`vlad(schema)`](#vladschema---functionvalue)
    - [`vlad.promise(schema)`](#vladpromiseschema---functionvalue)
    - [`vlad.callback(schema)`](#vladcallbackschema---functionvalue-callback)
    - [`vlad.middleware([prop, ] schema)`](#vladmiddlewareprop-schema---function-req-res-next)
- [Validation](#validation)
    - [Subvalidators](#subvalidators)
- [Schema](#schema)
    - [Property](#property)
    - [Function](#function)
    - [Object](#object)
- [Property Types](#property-types)
    - [Base Property](#base-property)
    - [`vlad.string`](#vladstring)
        - [`vlad.addFormat(name, handler)`](#vladaddformatname-handler)
    - [`vlad.number`](#vladnumber)
    - [`vlad.integer`](#vladinteger)
    - [`vlad.boolean`](#vladboolean)
    - [`vlad.date`](#vladdate)
    - [`vlad.array`](#vladarray)
    - [`vlad.enum(options)`](#vladenumoptions)
    - [`vlad.equals(value [, message])`](#vladequalsvalue--message)
    - [`vlad.any`](#vladany)
- [Errors](#errors)
    - [`vlad.ValidationError(message)`](#vladvalidationerrormessage)
    - [`vlad.FieldValidationError(message)`](#vladfieldvalidationerrormessage)
    - [`vlad.GroupValidationError(message, fields)`](#vladgroupvalidationerrormessage-fields)
    - [`vlad.ArrayValidationError(message, fields)`](#vladarrayvalidationerrormessage-fields)
    - [`vlad.SchemaFormatError(message)`](#vladschemaformaterrormessage)

## Creation

##### `vlad(schema)` -> `function(value)`
Create a new validation function. This function will take in a value and return a promise that either resolves with the validated values, or rejects with the relevant errors.

##### `vlad.promise(schema)` -> `function(value)`
An alias for [`vlad(schema)`](#vladschema---function)

##### `vlad.callback(schema)` -> `function(value, callback)`
Create a new validation function. This function will take in a value to validate and a node-style callback that must accept an error as the first argument and the validated value as the second arguments.

##### `vlad.middleware([prop,] schema)` -> `function(req, res, next)`
Create a new middleware styled function to validate a certain property on a request. By default the `prop` field will be `"query"`.

This can be useful when parsing and normalizing basic queries in express, especially since vlad will automatically attempt to parse `"true"`, `"false"`, and numeric strings to their actual values.


## Validation

The three basic types of validation are by _promise_, _callback_, or _middleware_. Because vlad is based on [Bluebird](https://github.com/petkaantonov/bluebird) the _promise_ based syntax is the most powerful, with [subvalidators](#subvalidators) readily available.

```javascript

// promise
var validator = vlad(schema); // or vlad.promise(schema);
validator(object)
    .then(/* handle value */)
    .catch(/* or handle error */);

// callback
var validator = vlad.callback(schema);
validator(object, function(err, value) {
    if (err) {
        // handle error
    } else {
        // handle value
    }
});

// middleware
var validator = vlad.middleware('query', {
    limit: vlad.integer.default(10).within(5, 15),
    offset: vlad.integer.default(0).min(0)
});

router.get('/', validator, function(req, res, next) {
    // GET /?limit=7
    req.query.limit === 7;
    req.query.offset === 0;
});

router.use(function(err, req, res, next) {
    // handle 'err'
});

```

### Subvalidators
Subbvalidators are only available through the promise syntax. They are easier to explain by example.

```javascript
var validate = vlad({
    a: vlad({
        nested: vlad({
            path: vlad.string
        })
    })
});

// validate the whole object
validate({a: {nested: {path: "hello world"}}}).then(/* */);

// validate a subobject using a subvalidator
validate.a.nested({path: "hello world"}).then(/* */);

// validate specific field using a subvalidator
validate.a.nested.path("hello world").then(/* */);
```

## Schema

The vlad function can parse several types of schema when creating validation functions. Invalid types should automatically throw a `vlad.SchemaFormatError`.

##### Property
The most common type of schema is a _property_. More information about them can be found [below](#propertytypes).

##### Function
You can pass in your own custom validation function to vlad. The function will be called using [bluebird](https://github.com/petkaantonov/bluebird)'s [`Promise.try`](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisetryfunction-fn--arraydynamicdynamic-arguments--dynamic-ctx----promise). Which means you can feel free to return asynchronous promises, or synchronously throw errors / return values.

__Note:__ You must return the validated value (or a promise that resolves to the validated value), or the valid result will always appear to be `undefined`.

```
// wrong
var validator = vlad(function(value) {
    if (isNotValid(value)) throw vlad.FieldValidationError("Value is bad.");
});

// right
var validator = vlad(function(value) {
    if (isNotValid(value)) throw vlad.FieldValidationError("Value is bad.");

    return value;
});
```

##### Object
To validate object values, you can pass in a plain object.

__Note:__ you can only use properties or functions as the values, not other objects. To nest objects wrap the subobject in a validation function.

```javascript
var validator = vlad({
    a: vlad.string,
    nested: vlad({
        a: vlad.string
    })
});
```

## Property Types

##### `Base Property`
All property types extends this base property.

* `property.default(value)` - value to default to (default value skips validation)
* `property.required` - force this value to not be `undefined`. Will fallback to default value if default value is set.
* `property.catch` - catch all validation errors by making value equal to default (even if `undefined`)
* `property.is`, `property.has`, `property.and` - filler words

##### `vlad.string`
* `vlad.string.maxLength(length)` (or `.max(length)`)
* `vlad.string.minLength(length)` (or `.min(length)`)
* `vlad.string.within(min, max)`
* `vlad.string.pattern(regex)`
* `vlad.string.format(format)` - from added formats

###### `vlad.addFormat(name, handler)`
Lets you add in special string formats using more complex validation than regexes. The handler function gets the current value and returns the error string if there was an error.

##### `vlad.number`
* will attempt to automatically parse strings to numbers
* `vlad.number.multipleOf(value)`
* `vlad.number.max(max)`
* `vlad.number.min(min)`
* `vlad.number.within(min, max)`

##### `vlad.integer`
* extends `vlad.number`
* will attempt to automatically parse strings to integers
* only accepts integer values.

##### `vlad.boolean`
* no special options
* will automatically parse `"true"` and `"false"`

##### `vlad.date`
* Will attempt to convert all values to a Date object

##### `vlad.array`
* `vlad.array.min(length)` (or `.minLength(length)`)
* `vlad.array.max(length)` (or `.maxLength(length)`)
* `vlad.array.of(validator)`
```javascript
var subType = vlad(vlad.string); // or just `vlad.string`
var validator = vlad(vlad.array.of(subType));
```

##### `vlad.enum(options)`
* `options` - array of possible values

##### `vlad.equals(value [, message])`
* `value` - value it must equal
* `message` - optional error message

##### `vlad.any`
* Matches any data type.


## Errors

##### `vlad.ValidationError(message)`
* `err.message`
* `err.toJSON()` - returns a nice JSON representation of error.

##### `vlad.FieldValidationError(message)`
* extends `ValidationError`
* `err.message`

##### `vlad.GroupValidationError(message, fields)`
* extends `ValidationError`
* `err.message`
* `err.fields` - object of `ValidationErrors`

##### `vlad.ArrayValidationError(message, fields)`
* extends `GroupValidationError`
* `err.message`
* `err.fields` - object of `ValidationErrors`

##### `vlad.SchemaFormatError(message)`
* `err.message`
