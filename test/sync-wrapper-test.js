var SyncValidationError = require('../src/errors').SyncValidationError;

describe('vlad.sync', function() {

    it('should validate synchronously', function() {

        var validate = vlad.sync(vlad.string.required);
        validate(null, function(err, result) {
            console.log(err);
            expect(err).to.be.instanceOf(Error);
        });
    });

    it('should throw an error if asynchronous', function() {

        var validate = vlad.sync(function(){
            return Promise.resolve('foo');
        });

        validate('bar', function(err) {
            expect(err).to.be.instanceof(SyncValidationError);
        });
    });
});
