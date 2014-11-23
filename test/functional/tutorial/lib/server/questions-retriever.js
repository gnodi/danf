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