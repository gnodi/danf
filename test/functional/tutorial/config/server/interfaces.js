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