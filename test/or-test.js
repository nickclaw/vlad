describe('or validation', function() {

    var validate = vlad(vlad.or([
        vlad.sync(vlad.number),
        vlad.sync(vlad.string)
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
    })
});
