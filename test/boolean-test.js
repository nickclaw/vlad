describe.only('boolean property validation', function() {

    var validate = vlad(vlad.boolean);

    it('should accept true', function() {
        return validate(true).should.be.fulfilled
        .then(function(val) {
            expect(val).to.equal(true);
        });
    });

    it('should accept false', function() {
        return validate(false).should.be.fulfilled
        .then(function(val) {
            expect(val).to.equal(false);
        });
    });

    it('should reject an invalid value', function() {
        return validate('asdfasf').should.be.rejected
        .then(function(err) {
            expect(err).to.be.instanceof(vlad.FieldValidationError);
        });
    });

    it('should be able to convert "true"', function() {
        return validate('true').should.be.fulfilled
            .then(function(val) {
                expect(val).to.equal(true);
            })
    });

    it('should be able to convert "false"', function() {
        return validate('false').should.be.fulfilled
            .then(function(val) {
                expect(val).to.equal(false);
            })
    });

});
