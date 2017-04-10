describe('number property validation', function() {

    describe('max', function() {

        var max = vlad.promise(vlad.number.max(10));
        var exclusive = vlad.promise(vlad.number.max(10).exclusive);

        it('throws when value is higher than max', function() {
            return max(11).should.be.rejected;
        });
        it('throws when the value is higher - exclusive', function() {
            return exclusive(10).should.be.rejected;
        });

        it('doesnt throw otherwise', function() {
            return max(10).should.be.fulfilled;
        });
        it('doesnt throw otherwise - exclusive', function() {
            return exclusive(9).should.be.fulfilled;
        });
    });

    describe('min', function() {

        var min = vlad.promise(vlad.number.min(10));
        var exclusive = vlad.promise(vlad.number.min(10).exclusive);

        it('throws when value is lower than min', function() {
            return min(9).should.be.rejected;
        });
        it('throws when the value is lower - exclusive', function() {
            return exclusive(10).should.be.rejected;
        });

        it('doesnt throw otherwise', function() {
            return min(10).should.be.fulfilled;
        });
        it('doesnt throw otherwise - exclusive', function() {
            return exclusive(11).should.be.fulfilled;
        });
    });

    describe('multipleOf', function() {

        var validate = vlad.promise({
            value: vlad.number.multipleOf(10)
        });

        it('throws when the value isnt a multiple of', function() {
            return validate({value: 15}).should.be.rejected;
        });

        it('doesnt throw otherwise', function() {
            return validate({value: 100}).should.be.fulfilled;
        });
    });

    describe('parsing strings to numbers', function() {
        var validate = vlad.promise(vlad.number);

        it('throws when the value is not a number', function() {
            return validate('hello').should.be.rejected
                .then(function(err) {
                    expect(err).to.be.instanceof(vlad.FieldValidationError);
                });
        });

        it('throws when the value isnt numeric', function() {
            return validate('s100').should.be.rejected;
        });

        it('correctly parses a string to a number', function() {
            return validate('10.00001').should.be.fulfilled;
        });
    });

    // assume within works
});
