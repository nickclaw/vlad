describe('custom function validation', function() {

    function syncValidation(val) {
        if (!!val) return 'YAY';
        throw new Error(val + " is invalid.");
    }

    function asyncValidation(val) {
        return new Promise(function(res, rej) {
            setTimeout(function() {
                if (!!val) res('YAY');
                rej(new Error(val + ' is invalid.'));
            }, 1);
        });
    }

    describe('synchronous custom validation', function() {

        var validate = vlad(syncValidation);

        it('should accept a valid value', function() {
            return validate(true).should.be.fulfilled
            .then(function(val) {
                expect(val).to.equal('YAY');
            });
        });

        it('should reject an invalid value', function() {
            return validate(false).should.be.rejected
            .then(function(err) {
                expect(err).to.be.instanceof(Error);
                expect(err.message).to.equal("false is invalid.");
            });
        });
    });

    describe('asynchronous custom validation', function() {
        var validate = vlad(asyncValidation);

        it('should accept a valid value', function() {
            return validate(true).should.be.fulfilled
            .then(function(val) {
                expect(val).to.equal('YAY');
            });
        });

        it('should reject an invalid value', function() {
            return validate(false).should.be.rejected
            .then(function(err) {
                expect(err).to.be.instanceof(Error);
                expect(err.message).to.equal("false is invalid.");
            });
        });
    });

    describe('mixed validation', function() {

        var validate = vlad({
            sync: syncValidation,
            async: asyncValidation
        });

        it('should accept valid values', function() {

            return validate({sync: true, async: true}).should.be.fulfilled
            .then(function(val) {
                expect(val).to.deep.equal({sync: 'YAY', async: 'YAY'});
            });
        });

        it('should reject invalid values', function() {

            return validate({sync: false, async: false}).should.be.rejected
            .then(function(err) {
                expect(err).to.be.instanceof(vlad.GroupValidationError);
                expect(err.fields.sync.message).to.equal('false is invalid.');
                expect(err.fields.async.message).to.equal('false is invalid.');
            });
        });

    });

});
