Ajax App
========

[←](../index.md)

Documentation
-------------

The better way to do a website with native Danf is to make a single page application. This will allow you to maximize the performances and should offer a great experience to your users.

As you can do a pure socket application, you can also decide to make an AJAX application (of course you can use sockets at the same time) to keep features like deep linking, bookmarking and a full navigable website even without javascript. A mix of AJAX and sockets will, in most cases, be the best choice for your user experience.

### Use AJAX links

```jade
//- resource/private/view/index.jade

a(href='/a/1') a-1 (standard link - reload the page)
a(href='/a/2', data-ajax='{}') a-2 (AJAX link - reload the body of the page asynchronously)
a(href='/a/3', data-ajax='{"autoload":0}') a-3 (autoload AJAX link - load the content of the link automatically)
a(href='/a/4', data-ajax='{"autoload":60}') a-3 (autoload AJAX link - reload the content of the link automatically every 60 secondes)
```

* The first link is a standard link.
* The second link appears as a standard clickable link in the page. When you click it, the content of the link is loaded and displayed in the body. An history state is created and the path of your current URL becomes `/a/2`.
* The third link is loaded automaticaly and replaced with the loaded content. No history state is created. It feels like it is a normal part of the page. This is usefull to factorize page chunks like a menu, a header, a footer, ...
* The fourth link is like the third one, except that the content will be reloaded every 60 secondes.

For these AJAX links to work, you have to define a request event for each one:

```javascript
// config/common/config/events/request.js

'use strict';

module.exports = {
    a1: {
        path: '/a1',
        methods: ['get']
    },
    a2: {
        path: '/a1',
        methods: ['get']
    }
};
```

> It is a good practice to factorize the definition of the request event in common config, then to define specific attributes on each side:
> ```javascript
> // config/server/config/events/request.js
>
> 'use strict';
>
> module.exports = {
>     a1: {
>         headers: {
>             'Content-Type': 'application/json; charset=utf-8'
>         },
>         view: {
>             html: {
>                 layout: {
>                     file: '%view.path%/layout.jade'
>                 },
>                 body: {
>                     file: '%view.path%/a1.jade'
>                 }
>             }
>         }
>     }
> };
> ```

Here is an example of possible custom layout for the pages of your site:

```jade
//- resource/private/view/layout.jade

doctype html
html
    head
        title My App

        link(rel='icon', type='image/png', href='favicon.png')
        link(rel='stylesheet', type='text/css', href='/-/my-app/css/style.css')

        script.
            var require = {
                config: {
                    app: {
                        context: JSON.parse('!{_context}') || {}
                    }
                }
            };
        script(data-main='/app', src='/require', async)
    body
    header ...
    nav ...
    section(id='body')
        != _view.body
    footer ...
```

> You can move the body used by the AJAX app mechanism defining your own body element with the attribute `id="body"`.

And a possible simple corresponding view configuration:

```javascript
// config/server/config/events/request.js

'use strict';

module.exports = {
    home: {
        path: '/',
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
    }
};
```

> You can use another template engine using the [Express'](http://expressjs.com/api.html) mechanism. For this, you can use the variable `app` in your files `app-dev.js` and `app-prod.js`.

### Use AJAX forms

```jade
// resource/private/view/form.jade

form(action='/form', method='get', data-ajax='{}')
    label(for='name') Name:
    input(name='name', id='name', type='text')
    input(type='submit')
```

Here is a simple AJAX form allowing to post names (not a really interesting example ok...). As for links, you have to define a request event:

```javascript
// config/common/config/events/request.js

'use strict';

module.exports = {
    form: {
        path: '/form',
        methods: ['get', 'post']
    }
};
```

> By default, the content of the response of the submitted request is displayed in the body. You can alter this behaviour by defining the target attribute as a [JQuery selector](https://api.jquery.com/category/selectors/):
> ```data-ajax='{"target":"#result"}'```

Navigation
----------

[< Events](events.md) | [Testing >](testing.md)

[←](../index.md)
