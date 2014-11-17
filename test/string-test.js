describe('string property validation', function() {

    describe('maxLength', function() {

        var validate = vlad(vlad.string.maxLength(9));

        it('throws when the string is too long', function() {
            return validate('0123456789').should.be.rejected;
        });

        it('doesnt throw otherwise', function() {
            return validate('').should.be.fulfilled;
        });
    });

    describe('minLength', function() {

        var validate = vlad(vlad.string.minLength(5));

        it('throws when the string is too short', function() {
            return validate('').should.be.rejected;
        });

        it('doesnt throw otherwise', function() {
            return validate('12345').should.be.fulfilled;
        });
    });

    describe('pattern', function() {

        var validate = vlad({
            val: vlad.string.pattern(/^[A-Z]+$/)
        });

        it('throws when the pattern doesnt match', function() {
            return validate({val: 'ABCabc'}).should.be.rejected;
        });

        it('doesnt throw otherwise', function() {
            return validate({val: 'ABCABC'}).should.be.fulfilled;
        });
    });

    describe('within', function() {

        var validate = vlad({
            val: vlad.string.within(5, 9)
        });

        it('throws when the string is not within', function() {
            return validate({val: 'a'}).should.be.rejected
            .then(function() {
                return validate({val: '0123456789'}).should.be.rejected
            });
        });

        it('doesnt throw otherwise', function() {
            return validate({val: '0123456'}).should.be.fulfilled;
        });
    });
});
