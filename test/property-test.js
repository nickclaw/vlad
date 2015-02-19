var property = require('../src/property');

describe('property definition', function() {

    it('can be extended', function() {
        var newProperty = property.extend();
        expect(newProperty).to.not.equal(property);
        expect(property).to.equal(newProperty.__proto__);
        expect(property).to.deep.equal(newProperty);
    });

    it('should chain', function() {
        var prop = property.extend();
        expect(prop.default().required.catch).to.equal(prop);
    });

    it('correctly parses schema', function() {
        var schema = property.extend().required.catch.toSchema();
        expect(schema).to.deep.equal({
            required: true,
            catch: true
        });
    });

    it('can chain with useless variables', function() {
        var schema = property.extend();

        expect(schema.and.has.is).to.equal(schema);
    });

    describe('vlad.any property validation', function() {
        var validate = vlad({
            a: vlad.any.default(1),
            b: vlad.any.default('hello world'),
            c: vlad.any,
            d: vlad.any.required,
            e: vlad.any.required,
            f: vlad.any.required
        });

        it('allows any value through', function() {
            var obj = {
                a: 2,
                b: 'hello world',
                c: [],
                d: {},
                e: 2.4,
                f: new Date()
            };

            return validate(obj).should.be.fulfilled
            .then(function(val) {
                expect(val).to.deep.equal(obj);
            });
        });

        it('should fill in default values', function() {
            return validate({
                d: 1,
                e: 2,
                f: 3
            }).should.be.fulfilled
            .then(function(val) {
                expect(val.a).to.equal(1);
                expect(val.b).to.equal('hello world');
                expect(val.c).to.equal(undefined);
            });
        });

        it('should require required values', function() {
            return validate({

            }).should.be.rejected
            .then(function(err) {
                expect(err).to.be.instanceof(vlad.GroupValidationError);
                expect(err.fields).to.have.keys('d', 'e', 'f');
            });
        });
    });
});
