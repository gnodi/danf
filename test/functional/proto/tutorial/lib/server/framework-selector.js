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