var Promise = require('bluebird');

module.exports = promiseFactory;

function promiseFactory(fn) {
    var promise = Object.create(SyncPromise.prototype);
    var resolved = false;

    promise.result = undefined;
    promise.error = null;
    promise.sync = true;

    try {
        return resolve(fn(resolve, reject));
    } catch (e) {
        return reject(e);
    }

    function resolve(result) {
        if (resolved) return promise;
        if (result instanceof Promise) {
            promise = result;
            return promise;
        }
        resolved = true;
        promise.result = result;
        return promise;
    }

    function reject(error) {
        if (resolved) return promise;
        resolved = true;
        promise.error = error;
        return promise;
    }
}

promiseFactory.reject = function(err) {
    return promiseFactory(function(_, rej) {
        rej(err);
    });
};

promiseFactory.resolve = function(value) {
    return promiseFactory(function(res) {
        res(value);
    });
};

promiseFactory.try = function(fn, args, ctx) {
    var promise = Object.create(SyncPromise.prototype);
    var resolved = false;

    promise.result = undefined;
    promise.error = null;
    promise.sync = true;

    try {
        return resolve(fn.apply(ctx, args));
    } catch (e) {
        return reject(e);
    }

    function resolve(result) {
        if (resolved) return promise;
        if (result instanceof Promise) {
            promise = result;
            return promise;
        }
        resolved = true;
        promise.result = result;
        return promise;
    }

    function reject(error) {
        if (resolved) return promise;
        resolved = true;
        promise.error = error;
        return promise;
    }
}

function SyncPromise() {}

SyncPromise.prototype.then = function(res, rej) {
    var value = this.error || this.result;
    var fn = this.error ? rej : res;
    return promiseFactory(function() {
        return fn(value);
    });
};

SyncPromise.prototype.catch = function(fn) {
    var value = this.error || this.result;
    fn = this.error ? function(){return value;} : fn;
    return promiseFactory(fn);
};
