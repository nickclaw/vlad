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

    describe('format', function() {

        vlad.addFormat('is-zero', function(data) {
            if (data !== '0') return "Value is not 0";
            return null;
        });

        var validate = vlad(vlad.string.format('is-zero'));

        it('should not reject a valid format', function() {

            return validate('0').should.be.fulfilled
            .then(function(value) {
                expect(value).to.equal('0');
            });
        });

        it('should reject an invalid format', function() {

            return validate('1').should.be.rejected;
        });
    });

    describe('parsing numbers to strings', function() {

        var validate = vlad(vlad.string);

        it("should parse an integer to a string", function() {
            return validate(0).should.be.fulfilled
            .then(function(value) {
                expect(value).to.equal('0');
            });
        });

        it('should parse a float to a string', function() {
            return validate(0.11).should.be.fulfilled
            .then(function(value) {
                expect(value).to.equal('0.11');
            });
        });
    });

    describe('parsing booleans to strings', function() {

        var validate = vlad(vlad.string);

        it('should parse true to "true"', function() {
            return validate(true).should.be.fulfilled
            .then(function(value) {
                expect(value).to.equal('true');
            });
        });

        it('should parse false to "false"', function() {
            return validate(false).should.be.fulfilled
            .then(function(value) {
                expect(value).to.equal('false');
            });
        });
    });
});
