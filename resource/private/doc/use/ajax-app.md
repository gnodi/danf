Make an Ajax App
================

[←](index.md)

Documentation
-------------

As a lot of js files are requested by the browser, it is a nice idea to work in an ajax app mode to increase performances (less network bandwidth, less js interpretation time).
Danf provides an easy way to do that while keeping deep linking and bookmarking.

### Use ajax links

```jade
//- resource/private/view/index.jade

p
    a(href='/a/1') a-1 (standard link - reload the page)
p
    a(class='ajax', href='/a/2') a-2 (ajax link - reload the body of the page asynchronously)
p
    a(class='ajax-autoload', href='/a/3') a-3 (autoload ajax link - load the content of the link automatically)
p
    a(class='ajax-autoload', href='/a/4', data-ajax='{"reloadTime":10}') a-4 (autoload ajax link with reload - load the content of the link automatically every 10 seconds)
```

The second link will appear as a clickable link in the page. When you click it, an history will be created and the path of your current url will become `/a/2`.
The third and fourth links will load automaticaly in the page. No history will be created. It is like they are parts of the index page.

Here is the corresponding config to handle these links:

```javascript
// config/server/events/request.js

'use strict';

module.exports = {
    home: {
        path: '',
        methods: ['get'],
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/index.jade'
                }
            }
        }
    },
    a: {
        path: '/a/:number',
        methods: ['get'],
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/a.jade',
                    embed: {
                        date: {
                            file: '%view.path%/date.jade',
                        }
                    }
                }
            }
        },
        sequences: ['getDate']
    }
};
```

```javascript
// config/server/sequences.js

'use strict';

module.exports = {
    getDate: [
        {
            service: 'danf:manipulation.callbackExecutor',
            method: 'execute',
            arguments: [
                function(parameters) {
                    var date = new Date();

                    parameters.date = date.toLocaleTimeString();
                },
                '@.@'
            ]
        }
    ]
};
```

And the template files:

```jade
//- resource/private/view/layout.jade

doctype html
html
    head
        title Danf application

        link(rel='stylesheet', type='text/css', href='-/tutorial/resource/public/css/style.css')

        script.
            var require = {
                config: {
                    app: {
                        context: JSON.parse('!{_context}') || {}
                    }
                }
            };
        script(data-main='/app', src='/require')
    body
        != _view.body
```

This file is already present in the proto application.


```jade
//- resource/private/view/a.jade

div
    a(class='ajax', href='/') index

    p
        span a-
        span= number
    p!= _view.date
```

Note how the result of the interpretation of the embedded file `'%view.path%/date.jade'` is injected here thanks to `_view.date`.

```jade
//- resource/private/view/date.jade

span(class='date')= '(' + date + ')'
```

Finally, You can add some CSS:

```css
/* resource/public/css/style.css */

.date {
    color: grey;
    font-size: 90%;
    font-style: italic;
}
```

You can use the embedded mechanism for the layout part. It is also possible to define another body location for your ajax links using the id `ajax-body` in your HTML:

```jade
//- resource/private/view/layout.jade

doctype html
html
    head
        title Danf application

        link(rel='stylesheet', type='text/css', href='-/tutorial/resource/public/css/style.css')

        script.
            var require = {
                config: {
                    app: {
                        context: JSON.parse('!{_context}') || {}
                    }
                }
            };
        script(data-main='/app', src='/require')
    body
        div
            != _view.menu
        div(id='ajax-body')
        div
            != _view.footer
```

You can use another template engine using the [Express'](http://expressjs.com/api.html) mechanism. For this, you can use the variable `app` in your files `app-dev.js` and `app-prod.js`.

### Use ajax forms

```jade
// resource/private/view/framework.jade

form(action='/name', id='framework-form' class='ajax', method='post')
    label(for='name')Name:
    input(name='name', type='text')
    input(type='submit', data-ajax='{"event": "postName"}')
```

Here is a simple ajax form allowing to post names (not a really interesting example ok...). The server side is not explicited here but you can handle its response like the following thanks to `data-ajax='{"event": "postName"}'`:

```javascript
// config/client/events/event.js

'use strict';

define(function(require) {
    return {
        'danf:form.postName': {
            sequences: ['postName']
        }
    }
});
```

```javascript
// config/client/sequences.js

'use strict';

define(function(require) {
    return {
        postName: [
            {
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(data, input) {
                        alert('New name added: {0}'.format(input.name));
                        console.log(data);
                    },
                    '@data.data@',
                    '@data.input@'
                ]
            }
        ]
    }
});
```

You can see an interesting example in the application accessible below in the navigation part.

Navigation
----------

[Previous section](app.md) |
 [Next section](event.md)

[Application](../test/ajax-app.md)

[←](index.md)