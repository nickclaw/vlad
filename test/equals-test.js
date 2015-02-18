describe('straight equals validation', function() {

    var validate = vlad(vlad.equals(true, 'you did not accept the terms'));

    it('should accept the matching value', function() {
        return validate(true).should.be.fulfilled
        .then(function(val) {
            expect(val).to.equal(true);
        });
    });

    it('should reject a non-matching value with a message', function() {

        return validate(false).should.be.rejected
        .then(function(err) {
            expect(err).to.be.instanceof(vlad.FieldValidationError);
            expect(err.message).to.equal('you did not accept the terms');
        });

    });
});
