var util = vlad.util;

describe('the src/util.js functions', function() {

    describe('util.defineGetters', function() {
        var obj = util.defineGetters({}, {

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

    describe('util.defineSetters', function() {
        var obj = util.defineSetters({}, {

            testContext: function() {
                expect(this).to.equal(obj);
            },

            testReturnSelf: function() {
                var a = 1 + 1;
            },

            testReturnValue: function() {
                return 1 + 1;
            },

            testArguments: function() {
                return arguments.length;
            }
        });

        it('sets context of handler correctly', function() {
            obj.testContext();
        });

        it('returns the context when no value is returned from handler', function() {
            expect(obj.testReturnSelf()).to.equal(obj);
        });

        it('returns a value when the handler returns one', function() {
            expect(obj.testReturnValue()).to.equal(2);
        });

        it('gets any given arguments', function() {
            expect(obj.testArguments(1, 2)).to.equal(2);
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

    describe('util.isObject', function() {
        var objects = [{}, Object.create({}), Object.create(null)];
        var notObjects = [1, 'test', null, undefined, [], Number(), String(), Math, function(){}];

        objects.forEach(function(value) {
            it('should accept', function() {
                expect(util.isObject(value)).to.equal(true);
            });
        });

        notObjects.forEach(function(value) {
            it('should reject ' + value, function() {
                expect(util.isObject(value)).to.equal(false);
            });
        });
    });

    describe('util.extend', function() {

        it('should extend the first object with the properties of the second object', function() {
            var a = { a: 'a', b: 'a' },
                b = { b: 'b', c: 'b' },
                c = util.extend(a, b);

            expect(c).to.have.keys('a', 'b', 'c');
            expect(c.a).to.equal('a');
            expect(c.b).to.equal('b');
            expect(c.c).to.equal('b');
        });

    });
});
