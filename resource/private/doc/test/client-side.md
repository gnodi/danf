Extend to the Client Side
=========================

[←](index.md)

Application
-----------

### Code for the client side

In Danf, you code on the client side the same way as on the server side.
Here is a class to display the list of scores associated to each framework:

```javascript
// lib/client/list-displayer.js

'use strict';

define(function(require) {
    function ListDisplayer() {
    }

    ListDisplayer.defineImplementedInterfaces(['displayer']);

    ListDisplayer.defineDependency('_measure', 'string');
    ListDisplayer.defineDependency('_jquery', 'function');
    ListDisplayer.defineDependency('_benchmarker', 'benchmarker');

    /**
     * Set the id of the computing measure.
     *
     * @param {measure}
     * @api public
     */
    Object.defineProperty(ListDisplayer.prototype, 'measure', {
        set: function(measure) { this._measure = measure; }
    });

    /**
     * Set JQuery.
     *
     * @param {function}
     * @api public
     */
    Object.defineProperty(ListDisplayer.prototype, 'jquery', {
        set: function(jquery) { this._jquery = jquery; }
    });

    /**
     * Set the benchmarker.
     *
     * @param {benchmarker}
     * @api public
     */
    Object.defineProperty(ListDisplayer.prototype, 'benchmarker', {
        set: function(benchmarker) { this._benchmarker = benchmarker; }
    });

    /**
     * @interface {ListDisplayer}
     */
    ListDisplayer.prototype.display = function(id, object) {
        var $ = this._jquery,
            list = $(document.createElement('ul'))
        ;

        for (var key in object) {
            var item = $(document.createElement('li'));

            item.text('{0}: {1}'.format(key, object[key]));
            list.append(item);
        }

        $('#{0}'.format(id)).html(list);
        $('#{0}-title'.format(id)).show();

        this._benchmarker.end(this._measure);
    }

    return ListDisplayer;
});
```

Note the [requirejs](http://requirejs.org/) wrapper around the class and the use of `return ListDisplayer;` at the end of the file instead of `module.exports = ListDisplayer;`.

As on the server side, you can define the config related to this class:

```javascript
// config/client/parameters.js

'use strict';

define(function(require) {
    return {
        computingMeasureId: 'Computing'
    }
});
```

```javascript
// config/client/classes.js

'use strict';

define(function(require) {
    return {
        listDisplayer: require('tutorial/lib/client/list-displayer'),
        benchmarker: require('tutorial/lib/common/benchmarker')
    }
});
```

```javascript
// config/client/interfaces.js

'use strict';

define(function(require) {
    return {
        displayer: {
            methods: {
                /**
                 * Display an object in the node element defined by the id.
                 *
                 * @param {string} id The id of the element.
                 * @param {object} object The object to display.
                 */
                display: {
                    arguments: ['string/id', 'object/object']
                }
            }
        }
    }
});
```

```javascript
// config/client/services.js

'use strict';

define(function(require) {
    return {
        listDisplayer: {
            class: 'listDisplayer',
            properties: {
                measure: '%computingMeasureId%',
                jquery: '#danf:vendor.jquery#',
                benchmarker: '#benchmarker#'
            }
        }
    }
});
```

### Code for both client-side and server-side

Of course, you might want to use a class on both client-side and server-side. You certainly see that we use a service `benchmarker` on these two sides but never defined it. Here is how it should be done:

```javascript
// lib/common/benchmarker.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    function Benchmarker() {
        this._measures = {};
    }

    Benchmarker.defineImplementedInterfaces(['benchmarker']);

    /**
     * @interface {benchmarker}
     */
    Benchmarker.prototype.start = function(measure) {
        var now = new Date();

        this._measures[measure] = now.getTime();
    }

    /**
     * @interface {benchmarker}
     */
    Benchmarker.prototype.end = function(measure) {
        if (!this._measures[measure]) {
            throw new Error('No measure for "{0}" started.'.format(measure));
        }

        var now = new Date();

        console.log('{0}: {1}ms'.format(
            measure,
            now.getTime() - this._measures[measure]
        ));

        delete this._measures[measure];
    }

    return Benchmarker;
});
```

The same wrapper as for the client side classes is used. Note the addition of the line `var define = define ? define : require('amdefine')(module);` which allows to select the correct requiring method.

Of course, you have the associated config:

```javascript
// config/interfaces.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        benchmarker: {
            methods: {
                /**
                 * Start a measure.
                 *
                 * @param {string} measure The id of the measure.
                 */
                start: {
                    arguments: ['string/measure']
                },
                /**
                 * End a measure and display the result in the console.
                 *
                 * @param {string} measure The id of the measure.
                 */
                end: {
                    arguments: ['string/measure']
                }
            }
        }
    }
});
```

```javascript
// config/services.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        benchmarker: {
            class: 'benchmarker'
        }
    }
});
```

Note that the definition of the classes has been done in both client and server `classes.js` because the needed `require` is different.

Navigation
----------

[Previous section](dependency-injection.md) |
 [Next section](events.md)

[Documentation](../use/client-side.md)

[←](index.md)