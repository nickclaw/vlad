describe('vlad validation errors', function() {

    describe('error types', function() {
        var they = it;

        they('should all inherit from ValidationError', function() {
            expect(new vlad.FieldValidationError()).to.be.instanceof(vlad.ValidationError);
            expect(new vlad.GroupValidationError()).to.be.instanceof(vlad.ValidationError);
            expect(new vlad.ArrayValidationError()).to.be.instanceof(vlad.ValidationError);
            expect(new vlad.ArrayValidationError()).to.be.instanceof(vlad.GroupValidationError);
        });

    });

    describe('serialization - toJSON', function() {

        it('should correctly deserialize a FieldValidationError into a string', function() {
            var res = new vlad.FieldValidationError("Invalid.").toJSON();
            expect(res).to.equal("Invalid.");
        });

        it('should correctly deserialize a FieldValidationError into a string', function() {
            var res = new vlad.GroupValidationError("Invalid object.", {
                field: new vlad.FieldValidationError("Invalid.")
            }).toJSON();

            expect(res.field).to.equal('Invalid.');
        });

        it('should correctly serialize into json', function() {

            var validator = vlad({
                field: vlad.string,
                group: vlad({
                    field: vlad.string,
                    subgroup: vlad({
                        field: vlad.string
                    })
                }),
                array: vlad.array.of(vlad({
                    field: vlad.string,
                    subgroup: vlad({
                        field: vlad.string
                    }),
                    subarray: vlad.array.of(vlad({
                        field: vlad.string
                    }))
                }))
            });

            return validator({
                field: 10,
                group: {
                    field: 10,
                    subgroup: {
                        field: 10
                    }
                },
                array: [
                    {
                        field: vlad.string,
                        subgroup: {
                            field: 10
                        },
                        subarray: [
                            {field: 10},
                            {field: 10}
                        ]
                    },
                    {
                        field: vlad.string,
                        subgroup: {
                            field: 10
                        },
                        subarray: [
                            {field: 10},
                            {field: 10}
                        ]
                    }
                ]
            }).catch(function(err) {
                expect(err.toJSON).to.be.instanceof(Function);
                expect(err.toJSON.bind(err)).to.not.throw(Error);

                var json = err.toJSON();

                // test random fields
                expect(json.field).to.be.truthy;
                expect(json.group.subgroup.field).to.be.truthy;
                expect(json.array['1'].subarray['0']).to.be.truthy;
            });
        });
    });

    describe('deserialization', function() {

        it('should deserialize a string into a FieldValidationError', function() {
            var error = vlad.ValidationError.fromJSON("Invalid field.");
            expect(error).to.be.instanceof(vlad.FieldValidationError);
        });

        it('should deserialize an object into a GroupValidationError', function() {
            var error = vlad.ValidationError.fromJSON({ field: "Invalid field." });
            expect(error).to.be.instanceof(vlad.GroupValidationError);
        });

        it('should deserialize an array into an ArrayValidationError', function() {
            var error = vlad.ValidationError.fromJSON([
                'Invalid field.',
                undefined,
                'Invalid field.'
            ]);

            expect(error).to.be.instanceof(vlad.ArrayValidationError);
            expect(error.fields[0]).to.be.instanceof(vlad.FieldValidationError);
            expect(error.fields[1]).to.be.undefined;
            expect(error.fields[2]).to.be.instanceof(vlad.FieldValidationError);
        });

        it('should correctly deserialize into an error', function() {

            var error = vlad.ValidationError.fromJSON({
                field: "Is terrible",
                nested: {
                    field: "Is also terrible",
                    more_nested: {
                        field: "Is more terrible"
                    }
                },
                array: [
                    "Equally bad.",
                    {
                        field: "Slightly more equally bad."
                    }
                ]
            });

            expect(error).to.be.instanceof(Error);
            expect(error).to.be.instanceof(vlad.ValidationError);
            expect(error.message).to.equal('Invalid object.');
            expect(error.fields).to.have.keys(['field', 'nested', 'array']);
            expect(error.fields.field.message).to.equal('Is terrible');
            expect(error.fields.array).to.be.instanceof(vlad.ArrayValidationError);
            expect(error.fields.array.message).to.equal("Invalid array.");
            expect(error.fields.array.fields[0]).to.be.instanceof(vlad.FieldValidationError);
            expect(error.fields.array.fields[1]).to.be.instanceof(vlad.GroupValidationError);
            expect(error.fields.array.fields[1].message).to.equal("Invalid object.");
            expect(error.fields.array.fields[1].fields.field.message).to.equal("Slightly more equally bad.");
            expect(error.fields.nested.message).to.equal('Invalid object.');
            expect(error.fields.nested.fields).to.have.keys([ 'field', 'more_nested' ]);
            expect(error.fields.nested.fields.more_nested.fields.field.message).to.equal('Is more terrible');
        });
    });
});
