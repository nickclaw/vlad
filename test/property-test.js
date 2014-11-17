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
        expect(prop.default().required.strict).to.equal(prop);
    });

    it('correctly parses schema', function() {
        var schema = property.extend().required.strict.toSchema();
        expect(schema).to.deep.equal({
            required: true,
            strict: true
        });
    });
});
