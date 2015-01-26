describe('enum property validation', function() {

    describe('string enum validation', function() {

        var validate = vlad(vlad.enum(['a', 'b', 'c', 'd']));

        it('should accept a valid value', function() {
            return validate('a').should.be.fulfilled
            .then(function(val) { expect(val).to.equal('a') });
        });

        it('should reject an invalid one', function() {
            return validate('e').should.be.rejected;
        });
    });

    describe('number enum validation', function() {

        var validate = vlad(vlad.enum([1,2,3,4]));

        it('should accept a valid value', function() {
            return validate(1).should.be.fulfilled
            .then(function(val) { expect(val).to.equal(1) });
        });

        it('should reject an invalid one', function() {
            return validate(5).should.be.rejected;
        });

        it('doesnt accept a valid castable type', function() {
            return validate('4').should.be.rejected;
        });
    });

    describe('mixed typed validation', function() {

        var validate = vlad(vlad.enum(['a', 1, 'b', 2]));

        it('works with one type', function() {
            return validate('a').should.be.fulfilled;
        });

        it('works with the other type', function() {
            return validate(1).should.be.fulfilled;
        });
    });

    describe('setting the default value', function() {

        var validate = vlad(vlad.enum(['a', 'b', 'c', 'd']).default('d'));

        it('correctly goes to the default value', function() {
            return validate().should.be.fulfilled
            .then(function(val) { expect(val).to.equal('d'); });
        });

    });

});
