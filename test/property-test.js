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

        expect(schema.and.has).to.equal(schema);
    });
});
