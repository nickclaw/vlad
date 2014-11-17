var util = vlad.util;

describe('the src/util.js functions', function() {

    describe('util.definePropert(y|ies)', function() {
        var obj = util.defineProperties({}, {

            testContext: function() {
                expect(this).to.equal(obj);
            },

            testReturnSelf: function() {
                var a = 1 + 1;
            },

            testReturnValue: function() {
                return 1 + 1;
            }

        });

        it('sets context of handler correctly', function() {
            obj.testContext;
        });

        it('returns the context when no value is returned from handler', function() {
            expect(obj.testReturnSelf).to.equal(obj);
        });

        it('returns a value when the handler returns one', function() {
            expect(obj.testReturnValue).to.equal(2);
        });
    });

    describe('util.keyMap', function() {
        var start = {a: 'alpha', b: 'beta'}

        it('maps keys correctly', function() {
            var goal = {'alpha': 'alpha', 'beta': 'beta'},
                end = util.keyMap(start, function(value, key) { return value; });

            expect(end).to.deep.equal(goal);
        });

        it('doesnt include out undefined keys', function() {
            var goal = {},
                end = util.keyMap(start, function() { return; });

            expect(end).to.deep.equal(goal);
        });
    });

    describe('util.resolveObject', function() {

        it('correctly resolves an object of mixed keys', function() {
            return util.resolveObject({
                a: "test",
                b: Promise.resolve('test'),
                c: {then: function(res, rej) { return res('test'); }}
            }).then(function(obj) {
                expect(obj.a).to.equal('test');
                expect(obj.b).to.equal('test');
                expect(obj.c).to.equal('test');
            }).catch(function(obj) {
                expect(obj).to.equal(undefined);
            });
        });

        it('correctly rejects the g', function() {
            return util.resolveObject({
                a: Promise.reject('test'),
                b: 'whoooo',
                c: {then: function(res, rej) { return rej('test'); }}
            }).then(function(obj) {
                expect(obj).to.equal(undefined);
            }).catch(function(obj) {
                expect(obj.a).to.equal('test');
                expect(obj.b).to.equal(undefined);
                expect(obj.c).to.equal('test');
            });
        });
    });

});
