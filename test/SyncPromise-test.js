var SyncPromise = require('../src/SyncPromise');

describe('SyncPromise class', function() {

    describe('SyncPromise', function() {

        it('should be able to resolve by callback', function() {
            var promise = SyncPromise(function(res) {
                res("foo");
                return "bar";
            });

            expect(promise.result).to.equal("foo");
        });

        it('should be able to resolve by return', function() {
            var promise = SyncPromise(function() {
                return "bar";
            });

            expect(promise.result).to.equal("bar");
        });

        it('should be able to reject by callback', function() {
            var errA = new Error();
            var errB = new Error();

            var promise = SyncPromise(function(res, rej) {
                rej(errA);
                throw errB;
            });

            expect(promise.error).to.equal(errA);
        });

        it('should be able to reject by throwing', function() {
            var err = new Error();

            var promise = SyncPromise(function(res, rej) {
                throw err;
            });

            expect(promise.error).to.equal(err);
        });

    });

    describe('SyncPromise.resolve', function() {
        it('should return a promise that resolves to a value', function() {
            var promise = SyncPromise.resolve('foo');
            expect(promise.result).to.equal('foo');
        });
    });

    describe('SyncPromise.reject', function() {
        it('should return a promise that rejects to an error', function() {
            var err = new Error();
            var promise = SyncPromise.reject(err);
            expect(promise.error).to.equal(err);
        });
    });

    describe('SyncPromise#then', function() {

        it('should return a SyncPromise object', function() {
            var a = SyncPromise.resolve('foo');
            expect(a.then).to.be.instanceOf(Function);

            var b = a.then(function() {
                return 'bar';
            });

            expect(a).to.not.equal(b);
            expect(a.result).to.equal('foo');
            expect(b.result).to.equal('bar');
        });

        it('should return a rejected SyncPromise on error', function() {
            var err = new Error();
            var a = SyncPromise.resolve('foo');

            var b = a.then(function() {
                throw err;
            });

            expect(a).to.not.equal(b);
            expect(a.result).to.equal('foo');
            expect(b.error).to.equal(err);
        });

        it('should handle errors with second argument function', function() {
            var err = new Error();
            var a = SyncPromise.reject(err);

            var b = a.then(null, function(err) {
                return "foo";
            });

            expect(a).to.not.equal(b);
            expect(a.error).to.equal(err);
            expect(b.result).to.equal('foo');
        });
    });

    describe('SyncPromise#catch', function() {

    });

    describe('upgrading to async', function() {
        it('should return a bluebird promise object if one is resolved', function() {
            var a = SyncPromise.resolve(Promise.resolve('foo'));
            expect(a).to.be.instanceof(Promise);
        });
    });
});
