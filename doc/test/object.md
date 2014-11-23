Develop with Object-Oriented Programming
========================================

[←](index.md)

Application
-----------

### Define classes

Let's define our first class:

```javascript
// lib/server/framework-selector.js

'use strict';

module.exports = FrameworkSelector;

function FrameworkSelector() {
}

FrameworkSelector.defineImplementedInterfaces(['frameworkSelector']);

FrameworkSelector.defineDependency('_frameworks', 'string_array');
FrameworkSelector.defineDependency('_categoryComputers', 'categoryComputer_array');

/**
 * Set the list of frameworks.
 *
 * @param {string_array}
 * @api public
 */
Object.defineProperty(FrameworkSelector.prototype, 'frameworks', {
    set: function(frameworks) { this._frameworks = frameworks; }
});

/**
 * Set the list of category computers.
 *
 * @param {categoryComputer_array}
 * @api public
 */
Object.defineProperty(FrameworkSelector.prototype, 'categoryComputers', {
    set: function(categoryComputers) { this._categoryComputers = categoryComputers; }
});

/**
 * @interface {frameworkSelector}
 */
FrameworkSelector.prototype.computeScores = function(answers) {
    var frameworkScores = {};

    for (var i = 0; i < this._frameworks.length; i++) {
        var framework = this._frameworks[i];

        frameworkScores[framework] = 0;

        for (var j = 0; j < this._categoryComputers.length; j++) {
            var computer = this._categoryComputers[j];

            frameworkScores[framework] += computer.compute(framework, answers);
        }
    }

    return frameworkScores;
}

/**
 * @interface {frameworkSelector}
 */
FrameworkSelector.prototype.weightScores = function(frameworkScores) {
    var scores = [];

    for (var framework in frameworkScores) {
        scores.push(frameworkScores[framework])
    }

    var maxScore = Math.max.apply(null, scores);

    for (var framework in frameworkScores) {
        frameworkScores[framework] *= 10 / maxScore;
        frameworkScores[framework] = Math.round(frameworkScores[framework]);
    }

    return frameworkScores;
}
```

It is really easy, you just have to declare a function and return it with `module.exports` as in any other node file.
You can, then, define some properties (as `frameworks`) and some methods (as `computeScores`) on this function that we will call class in the rest of the documentation.

This first class will guide the computing of scores for each frameworks.
We will not enter in the implementation details that is not the aim here.

The call of `defineImplementedInterfaces` on the class allows to define the implemented interfaces. The definition of these interfaces are described below. The call of `defineDependency` on the class ensure the type of the injected dependencies and their scope. You can learn more in the documentation accessible [here](../use/object.md) or at the end of this page in the navigation part.

The scores for each question are stored in csv files. The second step is to define a class able to retrieve these scores and handling the computing algorithm. In order to allow the definition of different categories of questions with different computing algoritms we are going to use classes inheritance.

Let's define an abstract class containing the factored code:

```javascript
// lib/server/category-computer/abstract.js

'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract category computer.
 */
function Abstract() {
    Object.hasMethod(this, 'computeBoost', true);
}

// Define the implemented interfaces.
Abstract.defineImplementedInterfaces(['categoryComputer']);

// Define the class as an abstract class.
Abstract.defineAsAbstract();

// Define the needed dependencies.
Abstract.defineDependency('_boost', 'number');
Abstract.defineDependency('_scoresDirectory', 'string');
Abstract.defineDependency('_questions', 'string_object');
Abstract.defineDependency('_sequencerProvider', 'danf:dependencyInjection.contextProvider', 'danf:manipulation.sequencer');
Abstract.defineDependency('_benchmarker', 'benchmarker');

/**
 * Set the dynamic boost.
 *
 * @param {number}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'boost', {
    set: function(boost) { this._boost = boost; }
});

/**
 * Set the directory of the score files.
 *
 * @param {string}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'scoresDirectory', {
    set: function(scoresDirectory) { this._scoresDirectory = scoresDirectory; }
});

/**
 * Set the associated questions.
 *
 * @param {string_object}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'questions', {
    set: function(questions) { this._questions = questions; }
});

/**
 * Set the provider of current sequencer.
 *
 * @param {danf:dependencyInjection.contextProvider<danf:manipulation.sequencer>}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'sequencerProvider', {
    set: function(sequencerProvider) {
        this._sequencerProvider = sequencerProvider;
    }
});

/**
 * Set the benchmarker.
 *
 * @param {benchmarker}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'benchmarker', {
    set: function(benchmarker) { this._benchmarker = benchmarker; }
});

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

/**
 * Compute the boost.
 *
 * @return {number}
 * @api protected
 */
Abstract.prototype.computeBoost = null;
```

You can see the protected abstract method `computeBoost` whom implementation in the child classes is forced by the call of `Object.hasMethod(this, 'computeBoost', true);` in the constructor.
We will talk about the special implementation of the method `compute` in a next section.

We have two categories of questions: the dumb ones and the useless ones.
Let's define the corresponding classes:

```javascript
// lib/server/category-computer/dumb.js

'use strict';

/**
 * Expose `Dumb`.
 */
module.exports = Dumb;

/**
 * Initialize a new dumb category computer.
 */
function Dumb() {
}

// Define the implemented interfaces.
Dumb.defineExtentedClass('categoryComputer.abstract');

/**
 * @inheritdoc
 */
Dumb.prototype.computeBoost = function() {
    return this._boost * 3;
}
```

```javascript
// lib/server/category-computer/useless.js

'use strict';

/**
 * Expose `Useless`.
 */
module.exports = Useless;

/**
 * Initialize a new useless category computer.
 */
function Useless() {
}

// Define the implemented interfaces.
Useless.defineExtentedClass('categoryComputer.abstract');

/**
 * @inheritdoc
 */
Useless.prototype.computeBoost = function() {
    return this._boost * 2;
}
```

Ok, the implementation is not really interesting and does not justify an inheritance, but remember that our objective is to discover the framework.
You can notice the method call `Dumb.defineExtentedClass('categoryComputer.abstract');`. This means that the class Dumb extend another class.

We are going to use a last class to retrieve all the configured questions in a flat object:

```javascript
// lib/server/questions-retriever.js

'use strict';

module.exports = QuestionsRetriever;

function QuestionsRetriever() {
}

QuestionsRetriever.defineImplementedInterfaces(['questionsRetriever']);

QuestionsRetriever.defineDependency('_questions', 'object');

/**
 * Set the configured questions.
 *
 * @param {object}
 * @api public
 */
Object.defineProperty(QuestionsRetriever.prototype, 'questions', {
    set: function(questions) { this._questions = questions; }
});

/**
 * @interface {questionsRetriever}
 */
QuestionsRetriever.prototype.retrieve = function() {
    var questions = {};

    for (var categoryName in this._questions.categories) {
        var category = this._questions.categories[categoryName];

        for (var computerName in category) {
            var computerQuestions = category[computerName].questions;

            for (var questionName in computerQuestions) {
                questions[questionName] = computerQuestions[questionName];
            }
        }
    }

    return questions;
}
```

###Declare classes

To make these classes use all the features of the framework you have to declare them in the configuration.
You have two choices: you can declare them directly in the `classes` section, but it is a good practice to declare them as parameters. You will see why in next sections.

```javascript
// config/server/parameters.js

'use strict';

module.exports = {
    classes: {
        frameworkSelector: require('../../lib/server/framework-selector'),
        questionsRetriever: require('../../lib/server/questions-retriever'),
        categoryComputer: {
            abstract: require('../../lib/server/category-computer/abstract'),
            dumb: require('../../lib/server/category-computer/dumb'),
            useless: require('../../lib/server/category-computer/useless')
        },
        benchmarker: require('../../lib/common/benchmarker')
    }
};
```

This is where is defined the name of the class `categoryComputer.abstract` we used in `Dumb.defineExtentedClass('categoryComputer.abstract');`.

This is done by default in the proto application (you don't have to do it) but the parameters are linked to the classes section in this manner:

```javascript
// config/classes.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return '%classes%';
});
```

###Define interfaces

Like it is explained in the [concepts](../concepts.md), interfaces are really important in object architectures. Danf highly encourages their use and provides an easy way to define them. Here is the definition of the interfaces we used for our classes:

```javascript
// config/server/interfaces.js

'use strict';

module.exports = {
    frameworkSelector: {
        methods: {
            /**
             * Compute a score for each framework from user's answers.
             *
             * @param {boolean_object} answers The answers of the user.
             * @return {number_object} The list of frameworks with their scores.
             */
            computeScores: {
                arguments: ['boolean_object/answers'],
                returns: 'number_object'
            },
            /**
             * Weight scores of each framework to have a score between 0 and 10.
             *
             * @param {number_object} frameworkScores The scores of the frameworks.
             * @return {number_object} The weighted scores of the frameworks.
             */
            weightScores: {
                arguments: ['number_object/frameworkScores'],
                returns: 'number_object'
            }
        }
    },
    questionsRetriever: {
        methods: {
            /**
             * Retrieve all the questions in a flat associative array.
             *
             * @return {string_object} The questions.
             */
            retrieve: {
                returns: 'string_object'
            }
        }
    },
    categoryComputer: {
        methods: {
            /**
             * Compute the score of a framework for associated questions from user's answer.
             *
             * @param {string} framework The name of the framework.
             * @param {boolean_object} answers The answers of the user.
             * @return {number} The score.
             */
            compute: {
                arguments: ['string/framework', 'boolean_object/answers'],
                returns: 'number'
            }
        }
    }
};
```

Learn more on the use and interest of interfaces in the documentation accessible below in the navigation part.

Navigation
----------

[Previous section](configuration.md) |
 [Next section](dependency-injection.md)

[Documentation](../use/object.md)

[←](index.md)