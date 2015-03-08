Master the Events
=================

[←](index.md)

Application
-----------

### Define events

Ok now, we have our configuration, our classes and their derived objects injected into each other on both client-side and server-side. The next step is to define events which will use these objects.

On the server side, we define events triggered by HTTP requests:

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
        framework: {
            path: '/framework',
            methods: ['get'],
            sequences: ['buildQuestionsForm'],
            view: {
                html: {
                    layout: {
                        file: '%view.path%/layout.jade'
                    },
                    body: {
                        file: '%view.path%/framework.jade'
                    }
                }
            }
        },
        apiGetFrameworksScores: {
            path: '/api/frameworks/scores',
            methods: ['get'],
            parameters: {
                answers: {
                    type: 'boolean_object',
                    default: {}
                }
            },
            sequences: ['computeFrameworkScores'],
            view: {
                json: {
                    select: ['frameworkScores']
                }
            }
        }
    }
};
```

The events from HTTP request are defined in the node `request` of the config. This kind of events can define a path and some HTTP methods compatible with the routing of [Express](http://expressjs.com/api.html). Note the definition of `parameters` for the event `apiGetFrameworksScores` which allows to define a contract (as for the configuration) for the request parameters. We will talk about the node `view` in a next section.

On the client side, we use a [JQuery](http://jquery.com/) DOM event when the user click on the submit button of the form and a custom event triggered when the ajax return of the submitted form is received (we talk more about that in a next section).

```javascript
// config/client/events.js

'use strict';

define(function(require) {
    return {
        dom: {
            formSubmitting: {
                selector: '#framework-form :submit',
                event: 'click',
                sequences: ['startComputingMeasure']
            }
        },
        event: {
            'danf:form.framework': {
                sequences: ['displayComputingResult']
            }
        }
    }
});
```

You can notice that all kind of events can define a node `sequences` which is an array of identifier names of sequences.

### Define sequences

Sequences, as their name suggests it, are sequences of operations. An operation is a call to a method of a service. A stream flows in a pipe made by these operations. In the case of a HTTP request, the input stream is formed by the request parameters.

```javascript
// config/server/sequences.js

'use strict';

module.exports = {
    computeFrameworkScores: [
        {
            service: 'frameworkSelector',
            method: 'computeScores',
            arguments: ['@answers@'],
            returns: 'frameworkScores'
        },
        {
            service: 'frameworkSelector',
            method: 'weightScores',
            arguments: ['@frameworkScores@'],
            returns: 'frameworkScores'
        }
    ],
    buildQuestionsForm: [
        {
            service: 'questionsRetriever',
            method: 'retrieve',
            returns: 'questions'
        }
    ]
};
```

The sequences `computeFrameworkScores` is processed when the form is submitted. Here is an example of input stream:

```javascript
{
    answers: {life: true; choice: true}
}
```

In the first operation, the method `computeScores` of the service `frameworkSelector` takes as first argument the `answers` object of the stream thanks to `@answers@`. The return of the operation will be stored in `frameworkScores`.

The resulting stream could be:

```javascript
{
    answers: {life: true; choice: true},
    frameworkScores: {
        danf: 15,
        meteor: 5,
        jquery: 3
    }
}
```

Then, it goes into the next operation. It is important to note that even if there are many asynchronous tasks (read files) in this first operation, the second task will not start before they all end.
This is better explained in the documentation accessible in the navigation part at the end of this page but remember the implementation of our asynchronous tasks:

```javascript
// lib/server/category-computer/abstract.js

'use strict';

// ...

/**
 * @interface {frameworkSelector}
 */
Abstract.prototype.compute = function(framework, answers) {
    var self = this,
        sequencer = this._sequencerProvider.provide()
    ;

    for (var name in this._questions) {
        (function(answer) {
            var questionFilename = '{0}/{1}.csv'.format(self._scoresDirectory, name),
                readTaskId = sequencer.wait(),
                measure = 'Computing "{0}/{1}"'.format(
                    framework,
                    name
                )
            ;

            self._benchmarker.start(measure);

            fs.readFile(questionFilename, function (error, data) {
                if (error) {
                    throw error;
                }

                var score = 0,
                    frameworkLines = data.toString().split("\n")
                ;

                for (var i = 0; i < frameworkLines.length; i++) {
                    var frameworkLine = frameworkLines[i].split(':');

                    if (framework === frameworkLine[0]) {
                        score = parseInt(frameworkLine[1], 10);

                        if (!answer) {
                            score *= -1;
                        }
                    }
                }

                sequencer.end(readTaskId, function(frameworkScores) {
                    self._benchmarker.end(measure);

                    frameworkScores[framework] += score;

                    return frameworkScores;
                });
            });
        })(answers[name]);
    }

    return self.computeBoost();
}
```

The method `var taskId = sequencer.wait()` create an id of task and wait this task to end. You can end it with the method `sequencer.end(taskId, callback)`. This prevents the next operation to start while a task is still processing. This is an elegant solution to avoid the callback hell because you have not to stack callbacks. At the end of each task, you can pass a callback impacting the stream of the current processed sequences. When all task are completed and have impacted the stream, the second operation can start with the impacted stream as input.

Of course, all these things respect the non-blocking I/O model of Node.

Here is the definition for the sequences on the client side:

```javascript
// config/client/sequences.js

'use strict';

define(function(require) {
    return {
        startComputingMeasure: [
            {
                service: 'benchmarker',
                method: 'start',
                arguments: ['%computingMeasureId%']
            }
        ],
        displayComputingResult: [
            {
                service: 'listDisplayer',
                method: 'display',
                arguments: ['result', '@data.data.frameworkScores@']
            }
        ]
    }
});
```

If you give many sequences for an event, they will be processed in the order of the array.

Navigation
----------

[Previous section](client-side.md) |
 [Next section](assets.md)

[Documentation](../use/events.md)

[←](index.md)