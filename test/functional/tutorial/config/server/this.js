'use strict';

module.exports = {
    frameworks: ['danf', 'require', 'angular', 'meteor', 'jquery', 'mootools'],
    questions: {
        directory: __dirname + '/../../resources/private/question-scores',
        categories: {
            dumb: {
                mega: {
                    boost: 3,
                    questions: {
                        color: 'In a world where blue is the only color, is blue your favorite color?',
                        choice: 'Yes or no?'
                    }
                },
                hyper: {
                    boost: 4,
                    questions: {
                        life: 'Do you understand why 42 is the answer to the ultimate question of life, the universe, and everything?'
                    }
                }
            },
            useless: {
                super: {
                    boost: 2,
                    questions: {
                        animals: 'Do you like animals?',
                        nanimals: 'Don\'t you like animals?'
                    }
                }
            }
        }
    }
};