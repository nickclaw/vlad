# API Reference

- [Creation](#creation)
    - [`vlad(schema)`](#vladschema---function)
    - [`vlad.promise(schema)`](#vladpromiseschema---function)
    - [`vlad.callback(schema)`](#vladcallbackschema---function)
    - [`vlad.middleware([prop, ] schema)`](#vladmiddlewareprop-schema---function)
- [Schema](#schema)
    - [Property](#property)
    - [Function](#function)
    - [Object](#object)
- [Validation](#validation)
- [Types](#types)
    - [Base Property](#base-property)
    - [`vlad.string`](#vladstring)
    - [`vlad.number`](#vladnumber)
    - [`vlad.integer`](#vladinteger)
    - [`vlad.boolean`](#vladboolean)
    - [`vlad.date`](#vladdate)
    - [`vlad.array`](#vladarray)
    - [`vlad.enum`](#vladenum)
- [Errors](#errors)
    - [`vlad.ValidationError`](vladvalidationerrormessage)
    - [`vlad.FieldValidationError`](vladfieldvalidationerrormessage)
    - [`vlad.GroupValidationError`](vladgroupvalidationerrormessage-fields)
    - [`vlad.ArrayValidationError`](vladarrayvalidationerrormessage-fields)

## Creation

##### `vlad(schema)` -> `function`

##### `vlad.promise(schema)` -> `function`

##### `vlad.callback(schema)` -> `function`

##### `vlad.middleware([prop,] schema)` -> `function`

## Schema

##### Property

##### Function

##### Object

## Validation

## Types

##### `Base Property`

##### `vlad.string`

##### `vlad.number`

##### `vlad.integer`

##### `vlad.boolean`

##### `vlad.date`

##### `vlad.array`

##### `vlad.enum`

## Errors

##### `vlad.ValidationError(message)`

##### `vlad.FieldValidationError(message)`

##### `vlad.GroupValidationError(message, fields)`

##### `vlad.ArrayValidationError(message, fields)`
