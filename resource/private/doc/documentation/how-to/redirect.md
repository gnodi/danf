How to Redirect a HTTP Request
==============================

[←](../index.md)

Usage
-----

You can use the [service](../dependency-injection.md) `danf:http.redirector` to redirect a HTTP request.

In a sequence:
```javascript
// config/server/config/sequences.js

'use strict';

module.exports = {
    redirect: {
        operations: [
            {
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['/somewhere']
            }
        ]
    }
};
```

Injected in a service:
```javascript
this.redirector.redirect('/here', 301);
```

> A redirect interrupt the flow (like an error would do). This means that the rest of your sequences won't be executed.

API
---

**Redirect a HTTP request.**

`.redirect(url, status)`

* *url (string)*: The URL/path of the redirect.
* *status (number)*: The optional redirect HTTP status code, default 302.

[←](../index.md)