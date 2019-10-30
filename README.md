## Grabber

Grabber is a helper in converting http requests. It catches server request and logs it into file in format which is suitable for a particular library.

Possible use case - generate autotest's flow using UI.

**Currently supported libraries:**
 - input - express.js
 - output - request.js, axios.js


**Example of usage:**

*server.js*

```javascript
... 
const Grabber = require('<path_to_grabber>');
const grabber = new Grabber({
    inputType: 'express',
    outputType: 'axios',
    url: 'http://example-api.com'
});
...
function Handler(req, res, next) {
...
    grabber.grab(req);
...
}

express.use(Handler);
```

*Output file*

```javascript
axios({"method":"POST","url":"http://example-api.com/api/test-route","data":{"value":100}})
```