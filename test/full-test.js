describe('validation stress test', function() {

    var validate = vlad({
        firstName: vlad.string.required.within(5, 15),
        lastName: vlad.string.required.default('').maxLength(25),

        age: vlad.integer.required.min(18).max(100),
        score: vlad.number.multipleOf(5.5).default(11)
    });

    it('should return the validated values', function() {
        var obj = {
            firstName: 'Nicholas',
            lastName: 'Clawson',
            age: 21,
            score: 16.5
        };

        return validate(obj).should.be.fulfilled
        .then(function(value) {
            expect(value).to.deep.equal(obj);
            expect(value).to.not.equal(obj);
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
        .then(function(errors) {
            expect(errors.firstName).to.be.truthy;
            expect(errors.lastName).to.be.truthy;
            expect(errors.age).to.be.truthy;
            expect(errors.score).to.be.truthy;
        });
    });
});
