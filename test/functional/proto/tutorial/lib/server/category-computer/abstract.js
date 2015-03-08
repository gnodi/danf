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