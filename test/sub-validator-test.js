describe('sub validator validation', function() {

    var validator = vlad({
        location: vlad({
            latitude: vlad.number.required.within(-180, 180),
            longitude: vlad.number.required.within(-90, 90)
        }),

        test: vlad.string.required
    });

    it('should have all sub validators', function() {

        expect(validator).to.be.instanceof(Function);
        expect(validator.location).to.be.instanceof(Function);
        expect(validator.location.latitude).to.be.instanceof(Function);
        expect(validator.location.longitude).to.be.instanceof(Function);
        expect(validator.test).to.be.instanceof(Function);
    });

});
