'use strict';

define(function(require) {
    return {
        processor: {
            methods: {
                /**
                 * Process to build an ajax app.
                 *
                 * @param {object} event The event object.
                 * @param {object} data The data associated to the event.
                 */
                process: {
                    arguments: ['object/event', 'object/data']
                }
            }
        },
        bodyProvider: {
            methods: {
                /**
                 * Provide the jquery body element.
                 *
                 * @param {object|undefined} dom The jquery dom tree to process. The displayed one by default.
                 * @return {object} The jquery body element.
                 */
                provide: {
                    arguments: ['object|undefined/dom'],
                    returns: 'object'
                }
            }
        },
        readyTrigger: {
            methods: {
                /**
                 * Trigger an ajax ready event.
                 *
                 * @param {object} data The data associated to the event.
                 */
                trigger: {
                    arguments: ['object/data']
                }
            }
        },
        historyHandler: {
            methods: {
                /**
                 * Initialize the first history point.
                 *
                 * @param {object} event The event object.
                 * @param {object} data The data associated to the event.
                 */
                initialize: {},
                /**
                 * Add a history point.
                 *
                 * @param {object} state The state of the history point.
                 * @param {string} path The path of the history point.
                 */
                add: {
                    arguments: ['object/state', 'string/path']
                },
                /**
                 * Navigate to a history point.
                 *
                 * @param {object} state The state of the history point.
                 */
                navigate: {
                    arguments: ['object/state']
                }
            }
        },
        linksHandler: {
            methods: {
                /**
                 * Follow a link.
                 *
                 * @param {object} link The link DOM node.
                 */
                follow: {
                    arguments: ['object/link']
                },
                /**
                 * Load the content of the auto loading links.
                 *
                 * @param {object} scope The jquery element which scope the load.
                 */
                load: {
                    arguments: ['object/scope']
                }
            }
        },
        formsHandler: {
            methods: {
                /**
                 * Submit a form.
                 *
                 * @param {object} submitter The submitter DOM node.
                 */
                submit: {
                    arguments: ['object/submitter']
                }
            }
        }
    };
});