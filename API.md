# API Reference

- [Creation](#creation)
    - [`vlad(schema)`](#vladschema---functionvalue)
    - [`vlad.sync(schema)`](#vladsyncschema---functionvalue)
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
    - [`vlad.or`](#vlador)
- [Errors](#errors)
    - [`vlad.ValidationError(message)`](#vladvalidationerrormessage)
    - [`vlad.FieldValidationError(message)`](#vladfieldvalidationerrormessage)
    - [`vlad.GroupValidationError(message, fields)`](#vladgroupvalidationerrormessage-fields)
    - [`vlad.ArrayValidationError(message, fields)`](#vladarrayvalidationerrormessage-fields)
    - [`vlad.SchemaFormatError(message)`](#vladschemaformaterrormessage)

## Creation

##### `vlad(schema)` -> `function(value)`
Create a synchronous validation function. This function will take in a value and throw a ValidationError or return the validated value. **This is the function you should use for nested validation**.

#### `vlad.sync(schema)` -> `function(value)`
The same as `vlad(schema)`.

##### `vlad.promise(schema)` -> `function(value)`
An alias for [`vlad(schema)`](#vladschema---function)

##### `vlad.callback(schema)` -> `function(value, callback)`
Create a new validation function. This function will take in a value to validate and a node-style callback that must accept an error as the first argument and the validated value as the second arguments.

##### `vlad.middleware([prop,] schema)` -> `function(req, res, next)`
Create a new middleware styled function to validate a certain property on a request. By default the `prop` field will be `"query"`.

This can be useful when parsing and normalizing basic queries in express, especially since vlad will automatically attempt to parse `"true"`, `"false"`, and numeric strings to their actual values.


## Validation

The 4 basic types of validation are by _sync_, _promise_, _callback_, or _middleware_.

```javascript

// sync
var validator = vlad(schema); // or vlad.sync(schema)
try {
  const value = validate(object);
  // handle value
} catch (e) {
  // handle error
}

// promise
var validator = vlad.promise(schema);
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

## Schema

The vlad function can parse several types of schema when creating validation functions. Invalid types should automatically throw a `vlad.SchemaFormatError`.

##### Property
The most common type of schema is a _property_. More information about them can be found [below](#propertytypes).

##### Function
You can pass in your own custom validation function to vlad. Through it, you must synchronously throw an error or return a value.

```
// wrong
var validator = vlad(function(value) {
    if (isNotValid(value)) throw vlad.FieldValidationError("Value is bad.");
    // no value returned!
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

##### `vlad.or([])`
* Tries each validator passed to it.

```js
vlad(vlad.or([
  vlad.string, //supports properties
  val => {     // or functions
    if (val === null) throw new Error('invalid');
    return val;
  }
]))
```

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
* `err.fields` - array of `ValidationErrors`

##### `vlad.SchemaFormatError(message)`
* `err.message`
