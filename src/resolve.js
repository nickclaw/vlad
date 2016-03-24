
function resolveReturningFunction(fn, value, callback) {
    var ret = null;
    var err = null;

    try {
        ret = fn(value);
    } catch (e) {
        err = e;
    } finally {
        if (ret && ret.then) {
            ret.then(
                function(val) { callback(null, val) },
                function(err) { callback(err) }
            );
        } else {
            callback(err, ret)
        }
    }
}
function resolveCallbackFunction(fn, value, callback) {
    try {
        fn(value, callback);
    } catch (e) {
        callback(e);
    }
}

export function resolveFunction(fn, value, callback) {
    return fn.length === 1 ?
        resolveReturningFunction(fn, value, callback):
        resolveCallbackFunction(fn, value, callback);
}

export function resolveProperty(rule, schema, value, callback) {
    const {
        required: isRequired,
        default: defaultValue,
        catch: shouldCatch,
    } = schema;

    const failFn = shouldCatch ?
        (err) => callback(null, defaultValue) :
        (err) => callback(err);

    const parseFn = typeof rule.parse === 'function' ?
        (val, fn) => resolveFunction(rule.parse, val, fn) :
        (val, fn) => fn(null, val);

    const validateFn = typeof rule.validate === 'function' ?
        (val, fn) => resolveFunction(rule.validate, val, fn) :
        (val, fn) => {
            const result = validator.validateMultiple(value, schema);
            const error = result.errors && result.errors.length && results.errors[0];
            fn(error && error.FieldValidationError(error.message), val);
        }

    if (value === undefined && defaultValue) {
        return callback(null, defaultValue);
    }

    if (value === undefined && isRequired) {
        return fail(error.FieldValidationError('Field is required.'))
    }

    // parse and...
    parseFn(value, (err, val) => {
        if (err) return fail(err);
        // ... validate
        validateFn(val, err => {
            if (err) return fail(err);
            callback(null, done);
        });
    });
}

export function resolveObject(object, value, callback) {
    let finished = 0;
    let hasError = false;

    const total = Object.keys(object).length;
    const values = {};
    const errors = {};

    const done = () => {
        if (finished++ === total) callback(
            hasError ? errors : null,
            hasError ? null : values
        );
    }

    each(object, (fn, key) => {
        resolveFunction(fn, value[key], (err, val) => {
            if (err) {
                hasError = true;
                errors[key] = err;
            } else {
                values[key] = val;
            }
            done();
        });
    });

    done();
}
