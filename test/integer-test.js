describe('integer property validation', function() {

    var validate = vlad.promise(vlad.integer);

    describe('validating integers', function() {
        it('should not allow floats', function() {
            return validate(10.5).should.be.rejected;
        });

        it('doesnt throw otherwise', function() {
            return validate(10).should.be.fulfilled;
        });
    });

    describe('parsing strings to integers', function() {
        var validate = vlad.promise(vlad.integer);

        it('throws when the value is not a number', function() {
            return validate('hello').should.be.rejected;
        });

        it('throws when the value isnt numeric', function() {
            return validate('s100').should.be.rejected;
        });

        it('doesnt allow floats as strings', function() {
            return validate('10.5').should.be.rejected;
        });
    });
});
