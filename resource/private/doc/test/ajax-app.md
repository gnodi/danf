Make an Ajax App
================

[←](index.md)

Application
-----------

Here we are! The last step is to define the user interface.
As a lot of js files are requested by the browser, it is a nice idea to work in an ajax app mode to increase performances (less network bandwidth, less js interpretation time).
Danf provides an easy way to do that while keeping deep linking and bookmarking.

You saw in a previous chapter how to define an HTTP request event:

```javascript
// config/server/events.js

'use strict';

module.exports = {
    request: {
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
        },
        // ...
    }
};
```

In the view node, we used a layout file: `%view.path%/layout.jade`. This file already exists in a proto app:

```jade
// resources/private/view/layout.jade

doctype html
html
    head
        title Danf application

        link(rel='stylesheet', type='text/css', href='tutorial/public/css/style.css')

        script.
            var require = {
                config: {
                    'main': {
                        context: JSON.parse('!{_context}') || {}
                    }
                }
            };
        script(data-main='/main', src='/require')
    body
        != _view.body
```

`script(data-main='/main', src='/require')` allows to load all our javascript files in an asynchronous way (which avoid a bad feeling for the user).
The content of the body file `%view.path%/index.jade` will be injected in the body of the layout thanks to `_view.body`.

```jade
// resources/private/view/index.jade

h1 Hi!

p This is the code of tutorial documented in the doc directory.

p
    a(class='ajax-autoload', href='/framework') Find your framework here!
```

We illustrate in our index file a simple ajax behaviour: if you set the class `ajax-autoload` on a link, the target of this link will be requested with an xhr request and the body of the response content will replace the link. If javascript is disabled, you will still have a standard link to an HTML page.

The related content is the questions form:

```jade
// resources/private/view/framework.jade

h2 Answer the following questions to find the framework of your dream!

p (Check boxes to answer yes)

form(action='/api/frameworks/scores', id='framework-form' class='ajax', method='get', data-ajax='{"dataType": "json"}')
    ul
      each question, name in questions
        li
            label= question
            input(name='answers['+name+']', type='checkbox', value=1)
    input(type='submit', data-ajax='{"event": "framework", "preventDefault": true, "preventHistory": true}')

h3(id='result-title') Result:
div(id='result')
```

Here, you can notice the use of an ajax form `form(action='/api/frameworks/scores', id='framework-form' class='ajax', method='get', data-ajax='{"dataType": "json"}')`. We simulate the requesting of a JSON API able to compute the scores for each framework. On success, the content of the response will be set as the stream of an event `danf:form.framework` as defined in `input(type='submit', data-ajax='{"event": "framework", "preventDefault": true, "preventHistory": true}')`.
This event, will then be catched in order to transform the JSON to an HTML list and display it in the `div(id='result')`:

```javascript
// config/client/events.js

'use strict';

define(function(require) {
    return {
        // ...
        event: {
            'danf:form.framework': {
                sequences: ['displayComputingResult']
            }
        }
    }
});
```

To avoid displaying the result title at the loading of the page, we add a few lines in our standard css file:

```css
/* resources/public/css/style.css */

#result-title {
    display: none;
}
```

At this point, everything should be ok. To start your application just go in the working root directory and call `node app-prod`.
The server should start:

```sh
Worker "1" processing.
Server running at "http://127.0.0.1:3080/"
```

Try this URL in your favorite browser and find the framework of your dream!

Navigation
----------

[Previous section](assets.md) |
 [Next section](tests.md)

[Documentation](../use/ajax-app.md)

[←](index.md)