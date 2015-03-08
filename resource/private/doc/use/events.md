Master the Events
=================

[←](index.md)

Documentation
-------------

Danf does not forget the spirit of javascript and Node: events drive the flow. You will be able to handle all incoming events the same way. For instance, a HTTP request event will be handled as a click on an element in the browser.
Moreover, the way the events are handled gives a pretty easy alternative to callback hell.

### Trigger events

Most of the time, events will be triggered by an action (a user request, a click on a DOM element, ...), but you can manually trigger an event. Let's see an example:

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

function Computer() {
}

Computer.defineDependency('_eventTrigger', 'danf:event.eventTrigger');

/**
 * Set the event trigger.
 *
 * @param {danf.event.eventTrigger}
 * @api public
 */
Object.defineProperty(Computer.prototype, 'eventTrigger', {
    set: function(eventTrigger) { this._eventTrigger = eventTrigger; }
});

Computer.prototype.compute = function() {
    var result;

    // ...

    this._eventTrigger.trigger('event', 'computationEnd', this, {computingResult: result});
}
```

You need to inject the service `danf:event.eventsHandler` in your own service and use the method `trigger`.
* The first argument `'event'` is the kind of event.
* The second argument `'computationEnd'` is the name of the event.
* The third argument `this` is the object triggering the event (it is used for computing the namespace).
* The fourth argument `{computingResult: result}` is the data associated to the event.

Here is the associated config where you can see how to inject the service for the triggering of the events:

```javascript
// config/server/classes.js

'use strict';

module.exports = {
    computer: require('../../lib/server/computer')
};
```

```javascript
// config/server/service.js

'use strict';

module.exports = {
    computer: {
        class: 'computer',
        properties: {
            eventTrigger: '#danf:event.eventsHandler#'
        }
    }
};
```

### Handle events

You should now ask you "how to link events to my code?". The response is always the same: some config!
There are several available kinds of events which define their own description for an event but the flow is the same for all:
* An event leads to the execution of some associated sequences when triggered.
* A sequence is a list of operations (methods of services) with some optional conditional statements.
* A stream is injected at the start of the sequences and each operation of each sequence can alter the stream.

**Note:**

> The operations of a sequence are executed synchronously in the order they are defined.
> The sequences of a list of sequences are executed synchronously in the order they are defined.
> This is the base for the mechanism allowing to avoid the callback hell.

Let's explain it in detailing the different types of events.

#### Event

The type `event` is the basic type for events and is available for both client-side and server-side:

```javascript
// config/events.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        event: {
            happenSomething: {
                contract: {
                    i: {
                        type: 'number',
                        default: 0
                    }
                },
                context: {
                    j: 2
                },
                callback: function(stream) {
                    console.log(stream.data.i);
                },
                sequences: ['doSomething']
            }
        }
    }
});
```

* `contract`: defines an optional contract to check the format of data passed on event triggering.
* `context`: defines an optional context that will be passed in the stream.
* `callback`: defines an optional callback that will be executed at the end of the execution of the sequence with the resulting output stream as first parameter.
* `sequences`: defines a list of sequences to execute.

Here is the definition for the sequences:

```javascript
// config/sequences.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        doSomething: [
            {
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(data) {
                        data.i++;
                    },
                    '@data@'
                ]
            },
            {
                condition: function(stream) {
                    return stream.data.i > 2;
                },
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(i) {
                        return ++i;
                    },
                    '@data.i@'
                ],
                returns: 'data.i'
            },
            {
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(i, j) {
                        return i + j;
                    },
                    '@data.i@',
                    '@context.j@'
                ],
                returns: 'data.i'
            }
        ]
    }
});
```

You can see the sequence `doSomething` defining 3 operations. To have a real functional and visual example we use the service `danf:manipulation.callbackExecutor` defined by the framework and allowing to execute a callback with some arguments. The first argument of the method `execute` is the callback and the next parameters are the passed arguments.

The first operation do exactly the same thing as the second one except that the second one has a condition to check before being executed. In the first operation, the data object is passed, thanks to the reference of type `@`, and the value of the property `i` is modified. In the second operation, The property `i` of the data object is passed and an incremented value is returned. This returned value is reinjected in the property `i` of the data object thanks to `returns: 'data.i'`. You can see how to access the context in the third operation (`@context.j@`).

* `service`: defines the service.
* `method`: defines the method of the service to execute.
* `arguments`: defines the arguments passed to the method.
* `returns`: defines the scope of return.
* `condition`: defines an optional condition to check: if the given callback returns `true`, then the method is executed.

**Note:**

> If a value is returned by the method, this will impact the stream.
> If no scope is defined with `returns`, all the stream will be replaced with the returned value.
> If no value is returned the stream will not be replaced or even impacted.

Finally, let's try some triggers:

```javascript
this._eventTrigger.trigger('event', 'happenSomething', this, {k: 0, done: done});
```

In this first case, the value of the resolved data is `{i: 0, k: 0, done: done}`. When the condition of the second operation is checked, it returns false because `stream.data.i === 1`. So, the value printed in the console by the callback (`console.log(stream.data.i);`) is `3` (0(i initial) + 1(increment) + 2(j)).

```javascript
this._eventTrigger.trigger('event', 'happenSomething', this, {i: 3, k: 3, done: done});
```

In this second case, the value of the resolved data is `{i: 3, k: 3, done: done}`. When the condition of the second operation is checked, it returns true because `stream.data.i === 4`. So, the value printed in the console by the callback (`console.log(stream.data.i);`) is `7` (3(i initial) + 2(increments) + 2(j)).

#### Request

The type `request` is the type for HTTP request events and is available for the server side:

```javascript
// config/server/events.js

'use strict';

module.exports = {
    request: {
        home: {
            path: '/schedule',
            methods: ['get'],
            headers: {
                'X-Powered-By': 'Danf'
            },
            parameters: {
                value: {
                    type: 'number',
                    required: true
                },
                inc: {
                    type: 'number',
                    default: 1
                }
            },
            view: {
                text: {
                    Start in: @start@
                },
                json: {
                    select: ['start']
                }
            },
            sequences: ['schedule']
        }
    }
};
```

* `path`: defines the path of the URL.
* `methods`: defines the list of the available HTTP methods for this path.
* `headers`: defines an optional list of headers to send in the response.
* `parameters`: defines an optional contract to check the format of the request parameters.
* `view`: defines the parameters for the different renderings.
* `sequences`: defines a list of sequences to execute.

Here is the definition for the sequences:

```javascript
// config/server/sequences.js

'use strict';

module.exports = {
    schedule: [
        {
            service: 'scheduler',
            method: 'start',
            arguments: [
                @value@,
                @inc@,
                %timeout%
            ],
            returns: 'start'
        },
        {
            service: 'danf:manipulation.callbackExecutor',
            method: 'execute',
            arguments: [
                function(start) {
                    return start + ' days';
                },
                '@start@'
            ],
            returns: 'start'
        }
    ]
};
```

And the rest of the config and code for this example:

```javascript
// config/server/parameters.js

'use strict';

module.exports = {
    timeout: 1000
};
```

```javascript
// config/server/classes.js

'use strict';

module.exports = {
    scheduler: require('../../lib/server/scheduler')
};
```

```javascript
// config/server/services.js

'use strict';

module.exports = {
    scheduler: {
        class: 'scheduler',
        properties: {
            currentSequencerProvider: '#danf:event.currentSequencerProvider#'
        }
    }
};
```

```javascript
// lib/server/scheduler.js

'use strict';

module.exports = Scheduler;

function Scheduler() {}

Scheduler.defineDependency('_currentSequencerProvider', 'danf:dependencyInjection.contextProvider', 'danf:manipulation.sequencer');

Object.defineProperty(Scheduler.prototype, 'currentSequencerProvider', {
    set: function(currentSequencerProvider) { this._currentSequencerProvider = currentSequencerProvider; }
});

Scheduler.prototype.start = function (value, inc, timeout) {
    var sequencer = this._currentSequencerProvider.provide();

    var firstInc = sequencer.wait();

    setTimeout(
        function() {
            sequencer.end(firstInc, function(value) {
                return value + inc;
            });
        },
        timeout + 20
    );

    var secondInc = sequencer.wait();

    setTimeout(
        function() {
            sequencer.end(secondInc, function(value) {
                return value + inc;
            });
        },
        timeout
    );

    return value + inc;
}
```

An asynchronous behaviour is simulated here with `setTimeout` to illustrate how to avoid the callback hell. The service `danf:event.currentSequencerProvider` allows you to retrieve the current `sequencer` that is processing the sequence. You can ask to wait for a task using the method `wait` that returns a task id. You can use this id to end the task with the method `end`. The first argument of this method is the task id and the second is a callback taking the stream (or the scoped stream if a scope of return is defined) as first argument. You can then return a value to modify the stream as in a synchronous method. In this example, you can see that you will increment the value three times: 2 asynchronous and 1 synchronous. The next operation of the sequence will not start before all tasks end. This way you have not to stack callbacks.

You can see a more functional example in the application accessible below in the navigation part.

Let's try some triggers now:

```
http://localhost/schedule?value=10&inc=2 (Accept: text/plain)
```

This will results in `Start in: 16 days`.

```
http://localhost/schedule?value=10 (Accept: application/json)
```

This will results in `{"start": "13 days"}`.

```
http://localhost/schedule (Accept: application/json)
```

This will results in an error 400 (Bad request) because the parameter `value` is required.

**Note:**

> Of course, you can trigger this type of events manually! This means that executing a sub request in Danf is simple as doing this:
>
> ```javascript
> this._eventTrigger.trigger('request', 'schedule', this, {value: 100, inc: 3});
> ```

#### Dom

The type `dom` is the type for DOM events and is available for the client side:

```javascript
// config/client/events.js

'use strict'

define(function(require) {
    return {
        dom: {
            formSubmitting: {
                selector: 'form :submit',
                event: 'click',
                preventDefault: true,
                stopPropagation: true,
                sequences: ['sequence1', 'sequence2', 'sequence3']
            }
        }
    }
});
```

* `selector`: defines the impacted DOM elements.
* `delegate`: defines a delegate for the event.
* `event`: defines the kind of event.
* `preventDefault`: allows to prevent the default behaviour (default false).
* `stopPropagation`: allows to stop the propagation of the event in the DOM tree (default false).
* `contract`: defines an optional contract to check the format of data passed on manual event triggering.
* `sequences`: defines a list of sequences to execute.

As you probably guess, [JQuery](http://jquery.com/) is used here. So you can refer to its own documentation for selectors, events, ...

The initial stream injected in the sequencer is of the form:

```javascript
{
    name: name,
    data: data || {},
    event: event
}
```

* `name`: is the name of the event.
* `data`: is the date passed on manual triggering.
* `event`: is the event object of JQuery.

For instance, you can access the JQuery element which is processing the event with `@event.currentTarget@`.

**Note:**

> You can and would use JQuery as a service. Danf is already defining this service for you: `danf:vendor.jquery`.

Navigation
----------

[Previous section](client-side.md) |
 [Next section](assets.md)

[Application](../test/events.md)

[←](index.md)