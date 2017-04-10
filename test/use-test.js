var requireNew = require('require-new');

describe('using custom validators', function() {

    var vlad;

    beforeEach(function() {
        vlad = requireNew('../index');
    });

    it('should throw if you try to add a validator of an invalid type', function() {
        var test = true;
        expect(vlad.use.bind(vlad, test)).to.throw(vlad.SchemaFormatError);
    });

    describe('that subclass Property', function() {


        it('should successfully return an error', function() {
            var test = vlad.property.extend();
            test.validate = function() {
                throw 'Error.';
            };
            vlad.use('test', test);

            var validate = vlad.promise(vlad.test);
            return validate('foo').should.be.rejected;
        });

        it('should successfully validate', function() {
            var test = vlad.property.extend();
            test.validate = function() {
                return true;
            };
            vlad.use('test', test);

            var validate = vlad.promise(vlad.test);
            return validate('foo').should.be.resolved;
        });
    });

    describe('that execute syncronously', function() {

        it('should successfully return an error', function() {
            vlad.use('test', function() {
                throw new Error();
            });

            var validate = vlad.promise(vlad.test);
            return validate('foo').should.be.rejected;
        });

        it('should successfully validate', function() {
            vlad.use('test', function() {
                return true;
            });

            var validate = vlad.promise(vlad.test);
            return validate('foo').should.be.resolved;
        });
    });
});
