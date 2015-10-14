'use strict';

module.exports = {
    renderer: {
        methods: {
            /**
             * Render a response.
             *
             * @param {object/request} request The request.
             * @param {object/response} response The response.
             * @param {object} context The context.
             * @param {object} config The config.
             * @param {function} callback A callback of which the first passed argument is the rendering result.
             */
            render: {
                arguments: [
                    'object/request',
                    'object/response',
                    'object/context',
                    'object/config',
                    'function/callback'
                ]
            }
        },
        getters: {
            /**
             * Contract that the view part of the controller should respect.
             *
             * @return {object}
             */
            contract: 'object',
        }
    },
    formatRenderer: {
        methods: {
            /**
             * Render a response.
             *
             * @param {object} response The response.
             * @param {object} context The context.
             * @param {object} config The config.
             * @param {function} callback A callback of which the first passed argument is the rendering result.
             */
            render: {
                arguments: [
                    'object/response',
                    'object/context',
                    'object/config',
                    'function/callback'
                ]
            }
        },
        getters: {
            /**
             * Handled format.
             *
             * @return {string}
             */
            format: 'string',
            /**
             * Relative content type header.
             *
             * @return {string}
             */
            contentTypeHeader: 'string',
            /**
             * Contract that the view part of the controller should respect.
             *
             * @return {object}
             */
            contract: 'object'
        }
    }
};