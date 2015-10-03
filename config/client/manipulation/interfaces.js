'use strict';

module.exports = {
    bodyProvider: {
        methods: {
            /**
             * Provide the jquery body element.
             *
             * @return {object} The jquery body element.
             */
            provide: {
                returns: 'object'
            }
        }
    },
    readyProcessor: {
        methods: {
            /**
             * Process a ready sequence on a scope element.
             *
             * @param {object} scope The scope element.
             */
            process: {
                arguments: ['object/scope']
            }
        }
    },
    history: {
        methods: {
            /**
             * Initialize the first history state.
             *
             * @param {object} event The event object.
             * @param {object} data The data associated to the event.
             */
            initialize: {},
            /**
             * Push a history state.
             *
             * @param {string|null} path The path.
             * @param {object|null} state The state.
             */
            push: {
                arguments: ['string|null/path', 'object|null/state']
            },
            /**
             * Replace the current history state.
             *
             * @param {string|null} path The path.
             * @param {object|null} state The state.
             */
            replace: {
                arguments: ['string|null/path', 'object|null/state']
            },
            /**
             * Navigate to a history state.
             *
             * @param {object} state The state.
             */
            navigate: {
                arguments: ['object/state']
            }
        }
    }
};