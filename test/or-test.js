describe('or validation', function() {

    var validate = vlad.promise(vlad.or([
        vlad(vlad.number),
        vlad(vlad.string)
    ]));

    var validateProperties = vlad.promise(vlad.or([
        vlad.boolean,
        vlad.number
    ]));

    var validateMixed = vlad.promise(vlad.or([
        vlad.number,
        vlad(vlad.string)
    ]));

    var validateMixedFunc = vlad.promise(vlad.or([
        vlad.number,
        function(val) {
          if (!typeof val === 'string') {
            throw new Error('Bad style foo error');
          }

          return 'FOO! ' + val
        }
    ]));


    it('should attempt the first possibility first', function() {
        return validate('1').then(val => {
            expect(val).to.equal(1);
        });
    });

    it('should fallback to the second possibility', function() {
      return validate('foo').then(val => {
          expect(val).to.equal('foo');
      });
    });

    it('should throw the last error (i guess)', function() {
      return validate({}).catch(err => {
          expect(err.message).to.equal('[object Object] is not a string');
      });
    });

    it('should validate properties', function() {
      return validateProperties({}).catch(err => {
          expect(err.message).to.equal('[object Object] is not a number.');
      });
    });

    it('should validate properties and return correctly', function() {
      return validateProperties(1).then(val => {
          expect(val).to.equal(1);
      });
    });

    it('should allow mixture of properties and functions', function() {
      return validateMixed({}).catch(err => {
          expect(err.message).to.equal('[object Object] is not a string');
      });
    });

    it('should allow mixture of properties and functions and return a correct value', function() {
      return validateMixed('foo').then(val => {
          expect(val).to.equal('foo');
      });
    });

    it('should return the last error message with mixed arrays', function() {
      return validateMixedFunc({}).catch(err => {
          expect(err.message).to.equal('Bad style foo error');
      });
    });

    it('should return the correct value from inline functions', function() {
      return validateMixedFunc('BAR').then(val => {
          expect(val).to.equal('FOO! BAR');
      });
    });

    it('should throw a schema error if or is passed an invalid vlad object', function() {
      try {
        var invalidOr = vlad.promise(vlad.or([
          1
        ]));
      } catch (e) {
        expect(e.message).to.equal('Invalid schema.')
      }
    });
});
