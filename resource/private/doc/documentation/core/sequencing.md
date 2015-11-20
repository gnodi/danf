Sequencing
==========

[←](../index.md)

![sequencing](../../../img/architecture-sequencing.png)

Documentation
-------------

Moreover, the way the events are handled gives a pretty easy alternative to callback hell.

###

Here is the definition for the sequences:

```javascript
// config/common/sequences.js

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

> - If a value is returned by the method, this will impact the stream.
> - If no scope is defined with `returns`, all the stream will be replaced with the returned value.
> - If no value is returned the stream will not be replaced or even impacted.

Finally, let's try some triggers:

```javascript
this._eventTrigger.trigger('event', 'happenSomething', this, {k: 0, done: done});
```

In this first case, the value of the resolved data is `{i: 0, k: 0, done: done}`. When the condition of the second operation is checked, it returns false because `stream.data.i === 1`. So, the value printed in the console by the callback (`console.log(stream.data.i);`) is `3` (0(i initial) + 1(increment) + 2(j)).

```javascript
this._eventTrigger.trigger('event', 'happenSomething', this, {i: 3, k: 3, done: done});
```

In this second case, the value of the resolved data is `{i: 3, k: 3, done: done}`. When the condition of the second operation is checked, it returns true because `stream.data.i === 4`. So, the value printed in the console by the callback (`console.log(stream.data.i);`) is `7` (3(i initial) + 2(increments) + 2(j)).

###

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

Navigation
----------

[< Dependency Injection](dependency-injection.md) | [Events >](events.md)

[←](../index.md)
