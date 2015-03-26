# API Reference

- [Creation](#creation)
    - [`vlad(schema)`](#vlad)
    - [`vlad.promise(schema)`](#vladpromise)
    - [`vlad.callback(schema)`](#vladcallback)
    - [`vlad.middleware([prop, ] schema)`](#vladmiddleware)
- [Schema](#schema)
    - [Property](#property)
    - [Function](#function)
    - [Object](#object)
- [Validation](#errors)
- [Types](#types)
    - [Base Property](#base_property)
    - [`vlad.string`](#vladstring)
    - [`vlad.number`](#vladnumber)
    - [`vlad.integer`](#vladinteger)
    - [`vlad.boolean`](#vladboolean)
    - [`vlad.date`](#vladdate)
    - [`vlad.array`](#vladarray)
    - [`vlad.enum`](#vladenum)
- [Errors](#errors)
    - [`vlad.ValidationError`](vladvalidationerror)
    - [`vlad.FieldValidationError`](vladfieldvalidationerror)
    - [`vlad.GroupValidationError`](vladgroupvalidationerror)
    - [`vlad.ArrayValidationError`](vladarrayvalidationerror)

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
