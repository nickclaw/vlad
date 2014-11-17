describe('integer property validation', function() {

    var validate = vlad(vlad.integer);

    it('should not allow floats', function() {
        return validate(10.5).should.be.rejected;
    });

    it('doesnt throw otherwise', function() {
        return validate(10).should.be.fulfilled;
    });

});
