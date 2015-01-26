describe('format stress test', function() {

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
