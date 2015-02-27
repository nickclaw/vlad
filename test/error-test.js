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

    describe('ValidationError.toJSON', function() {
        it('should correctly validate into json', function() {

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
});
