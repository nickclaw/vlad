describe('rejecting invalid schema', function() {
    var values = [1, 'hello world', [vlad.promise(vlad.string)], Number(), String(), null, undefined]

    describe('schema', function() {
        values.forEach(function(value) {
            it('should reject ' + value, function() {
                expect(vlad.bind(null, value)).to.throw(vlad.SchemaFormatError);
            });
        });
    });

    describe('subschema', function() {
        values.forEach(function(value) {
            it('should reject an object containing ' + value, function() {
                expect(vlad.bind(null, {test: value})).to.throw(vlad.SchemaFormatError);
            });
        });
    });
});
