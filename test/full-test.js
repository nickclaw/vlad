describe('validation stress test', function() {

    var validate = vlad({
        firstName: vlad.string.required.catch.within(5, 15),
        lastName: vlad.string.required.default('').maxLength(25),

        age: vlad.integer.required.min(18).max(100),
        score: vlad.number.multipleOf(5.5).default(11),
        text: vlad.integer
    });

    it('should be possible to access sub validators', function() {
        expect(validate.firstName).to.be.instanceof(Function);
        expect(validate.lastName).to.be.instanceof(Function);
        expect(validate.age).to.be.instanceof(Function);
        expect(validate.score).to.be.instanceof(Function);
        expect(validate.text).to.be.instanceof(Function);
    });

    it('should be possible to validate objects properties with vlad properties', function() {
        return Promise.all([
            validate.firstName('nicholas').should.be.fulfilled,
            validate.lastName('asdfsafasfasfasfasfasfasfasffafsadfasfsafsaf').should.be.rejected
        ]);
    });

    it('should return the validated values', function() {
        var obj = {
            firstName: 'Nicholas',
            lastName: 'Clawson',
            age: 21,
            score: 16.5,
            text: undefined
        };

        return validate(obj).should.be.fulfilled
        .then(function(value) {
            expect(value).to.deep.equal(obj);
            expect(value).to.not.equal(obj);
        });
    });

    it('should require values by default', function() {
        var obj = {};

        return validate(obj).should.be.rejected
        .then(function(err) {
            expect(err.fields.age).to.be.instanceof(vlad.FieldValidationError);
        });
    });

    it('should fill in defaults', function() {

        var obj = {
            firstName: 'Nicholas',
            age: 21
        };

        return validate(obj).should.be.fulfilled
        .then(function(value) {
            expect(value.lastName).to.equal('');
            expect(value.score).to.equal(11);
        });
    });

    it('should throw descriptive errors', function() {
        var obj = {
            lastName: 'abcdefghijklmnopqrstuvwxyz',
            age: 101,
            score: 1
        };

        return validate(obj).should.be.rejected
        .then(function(error) {
            expect(error.fields.firstName).to.not.be.ok;
            expect(error.fields.lastName).to.be.ok;
            expect(error.fields.age).to.be.ok;
            expect(error.fields.score).to.be.ok;
        });
    });

    it('rejects with an error', function() {
        var obj = {
            lastName: 'abcdefghijklmnopqrstuvwxyz',
            age: 101,
            score: 1
        };

        return validate(obj).should.be.rejected.then(function(err) {
            expect(err).to.be.instanceof(vlad.GroupValidationError);
            expect(err.fields.firstName).to.undefined;
            expect(err.fields.lastName).to.be.instanceof(vlad.FieldValidationError);
            expect(err.fields.age).to.be.instanceof(vlad.FieldValidationError);
            expect(err.fields.score).to.be.instanceof(vlad.FieldValidationError);
        });
    });
});
