describe('object property validation', function() {

    var validate = vlad(vlad.object);

    it('should accept {}', function() {
        return validate({}).should.be.fulfilled
        .then(function(val) {
            expect(val).to.deep.equal({});
        });
    });

    it('should accept []', function() {
        return validate([]).should.be.fulfilled
        .then(function(val) {
            expect(val).to.deep.equal([]);
        });
    });

    it('should reject a non object', function() {
        return validate('asdfasf').should.be.rejected
        .then(function(err) {
            expect(err).to.be.instanceof(vlad.FieldValidationError);
        });
    });

    it('should reject null', function() {
        return validate(null).should.be.rejected
        .then(function(err) {
            expect(err).to.be.instanceof(vlad.FieldValidationError);
        });
    });
});
