describe('array property validation', function() {

    describe('validating array types', function() {

        var subType = vlad(vlad.number);
        var validate = vlad(vlad.array.of(subType));

        it('should accept a valid value', function() {
            return validate([1,2,3,4]).should.be.fulfilled
            .then(function(val) {
                expect(val).to.deep.equal([1,2,3,4]);
            });
        });

        it('should reject a non array', function() {
            return validate(10).should.be.rejected
            .then(function(err) {
                expect(err).to.be.instanceof(vlad.FieldValidationError);
            });
        });

        it('should reject an array with invalid types', function() {
            return validate(['a', 1, [], {}]).should.be.rejected
            .then(function(err) {
                expect(err).to.be.instanceof(vlad.ArrayValidationError);
                expect(err.fields['0']).to.be.instanceof(vlad.FieldValidationError);
                expect(err.fields['1']).to.be.undefined;
                expect(err.fields['2']).to.be.instanceof(vlad.FieldValidationError);
                expect(err.fields['3']).to.be.instanceof(vlad.FieldValidationError);
            });
        });
    });

    describe('validating array length', function() {

        // test min/max minLength/mathLength respectively
        for (var i = 0, array = ["", "Length"]; i < array.length; i++) {
            var validate = vlad(vlad.array['min' + array[i]](1)['max' + array[i]](1));

            it('should accept any array when no type is defined', function() {
                return validate([1]).should.be.fulfilled
                .then(function(val) {
                    expect(val).to.deep.equal([1]);
                });
            });

            it('should throw when the array is too small', function() {
                return validate([]).should.be.rejected
                .then(function(err) {
                    expect(err).to.be.instanceof(vlad.FieldValidationError);
                });
            });


            it('should throw when the array is too large', function() {
                return validate([1,2]).should.be.rejected
                .then(function(err) {
                    expect(err).to.be.instanceof(vlad.FieldValidationError);
                });
            });
        }
    });

});
