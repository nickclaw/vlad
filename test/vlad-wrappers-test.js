describe('callback style validation', function() {

    var validate = vlad.callback({
        a: vlad.string,
        b: vlad.number,
        c: vlad.integer.default(10)
    });

    it("should accept a valid value", function(done) {
        validate({
            a: 'test',
            b: 1
        }, function(err, data) {
            expect(err).to.be.null;
            expect(data.a).to.equal('test');
            expect(data.b).to.equal(1);
            expect(data.c).to.equal(10);
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

    var validate = vlad.middleware('body', {
        a: vlad.string,
        b: vlad.number,
        c: vlad.integer.default(10)
    });

    it("should accept a valid value", function(done) {
        var res = {},
            req = {
                body: {a: 'test', b: 1}
            };

        validate(req, res, function(err) {
            expect(err).to.equal(null);
            expect(req.body.a).to.equal('test');
            expect(req.body.b).to.equal(1);
            expect(req.body.c).to.equal(10);
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



    it('should default to query', function(done) {

        var validate = vlad.middleware({
            a: vlad.string.default('test')
        });

        var req = {query: {}},
            res = {};

        validate(req, res, function() {
            expect(req.query.a).to.equal('test');
            done();
        });

    });
});
