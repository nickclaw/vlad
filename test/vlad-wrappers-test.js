describe('callback style validation', function() {

    var validate = vlad.callback({
        a: vlad.string,
        b: vlad.number
    });

    it("should accept a valid value", function(done) {
        validate({
            a: 'test',
            b: 1
        }, function(err, data) {
            expect(err).to.equal(null);
            expect(data.a).to.equal('test');
            expect(data.b).to.equal(1);
            done();
        });
    });

    it("should reject an invalid value", function(done) {
        validate({
            a: 1,
            b: "test"
        }, function(err, data) {
            expect(err).to.be.instanceof(vlad.GroupValidationError);
            expect(err.fields.a).to.be.instanceof(vlad.FieldValidationError);
            done();
        });
    });

});


describe('middleware style validation', function() {

    var validate = vlad.middleware({
        a: vlad.string,
        b: vlad.number
    });

    it("should accept a valid value", function(done) {
        var res = {},
            req = {
                body: {a: 'test', b: 1}
            };

        validate(req, res, function(err) {
            expect(err).to.equal(null);
            done();
        });
    });

    it("should reject an invalid value", function(done) {
        var res = {},
            req = {
                body: {a: 1, b: 'test'}
            };

        validate(req, res, function(err) {
            expect(err).to.be.instanceof(vlad.GroupValidationError);
            expect(err.fields.a).to.be.instanceof(vlad.FieldValidationError);
            done();
        });
    });

});
