describe('date property validation', function() {

    var validate = vlad(vlad.date);

    //
    it ('should accept valid dates', function() {
        var now = new Date();

        return validate(now).should.be.fulfilled
        .then(function(val) {
            expect(val).to.equal(now);
        });
    });

    it('should reject invalid dates', function() {
        var date = new Date('asdfasdf');

        return validate(date).should.be.rejected
        .then(function(err) {
            expect(err).to.be.instanceof(vlad.FieldValidationError);
        });
    });


    //
    it('should convert valid date strings', function() {
        var now = new Date();

        return validate(now.toISOString()).should.be.fulfilled
        .then(function(val) {
            expect(val).to.deep.equal(now);
        });
    });

    it('should reject invalid date strings', function() {
        return validate('asdfasf').should.be.rejected
        .then(function(err) {
            expect(err).to.be.instanceof(vlad.FieldValidationError);
        });
    });


    //
    it('should convert valid ms since epoch', function() {
        var now = new Date();

        return validate(now.valueOf()).should.be.fulfilled
        .then(function(val) {
            expect(val).to.deep.equal(now);
        });
    });

    // not sure this is even invalid
    it.skip('should reject invalid ms since epoch', function() {
        return validate(100.000134).should.be.rejected
        .then(function(val) {
            expect(val).to.be.instanceof(vlad.FieldValidationError);
        });
    });
});
