vlad ![](https://travis-ci.org/nickclaw/vlad.svg)
------------------
JSON schema validation with a chainable promise based syntax.

### Example
```javascript
var validate = vlad({
    name: vlad.string.required,
    age: vlad.integer.default(18),

    location: vlad({
        long: vlad.number.required,
        lat: vlad.number.required
    })
});

validate(obj).then(
    function(value) {
        /*{
            name: "John Doe",
            age: 20,
            location: {
                long: 70.235,
                lat: 60.234
            }
        }*/
    },
    function(err) {
        /*{
            name: "is not type(s) string",
            location: {
                lat: "not 180"
            }
        }*/
    }
);
```
