'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        eventsHandler: {
            methods: {
                /**
                 * Add a notifier.
                 *
                 * @param {danf:event.notifier} notifier The notifier.
                 */
                addNotifier: {
                    arguments: ['danf:event.notifier/notifier']
                },
                /**
                 * Add an event.
                 *
                 * @param {string} notifierName The identifier name of the notifier.
                 * @param {string} name The identifier name of the event.
                 * @param {object} event The description of the event.
                 */
                addEvent: {
                    arguments: [
                        'string/notifierName',
                        'string/name',
                        'object/event'
                    ]
                }
            }
        },
        eventTrigger: {
            methods: {
                /**
                 * Trigger an event.
                 *
                 * @param {string} notifierName The identifier name of the notifier.
                 * @param {string} eventName The name of the event.
                 * @param {object} trigger The object which triggered the event.
                 * @param {mixed} data The data associated with the triggered event.
                 */
                trigger: {
                    arguments: [
                        'string/notifierName',
                        'string/eventName',
                        'object/trigger',
                        'mixed/data'
                    ]
                }
            }
        },
        sequenceBuilder: {
            methods: {
                /**
                 * Retrieve a built sequence.
                 *
                 * @param {string} name The identifier name of the sequence.
                 * @return {danf:manipulation.sequencer} A sequencer.
                 */
                get: {
                    arguments: ['string/name'],
                    returns: 'danf:manipulation.sequencer'
                },
                /**
                 * Build a sequence.
                 *
                 * @param {string} name The identifier name of the sequence.
                 * @param {object} event The description of the sequence.
                 * @return {danf:manipulation.sequencer} A sequencer.
                 */
                build: {
                    arguments: ['string/name', 'object/event'],
                    returns: 'danf:manipulation.sequencer'
                },
                /**
                 * Compose sequences in a unique sequence.
                 *
                 * @param {string_array} sequences The identifier of the sequences.
                 * @return {danf:manipulation.sequencer} A sequencer.
                 */
                compose: {
                    arguments: ['string_array/sequences'],
                    returns: 'danf:manipulation.sequencer'
                }
            }
        },
        notifier: {
            methods: {
                /**
                 * Add an event listener.
                 *
                 * @param {string} name The name of the event.
                 * @param {object} event The description of the event.
                 * @param {danf:manipulation.sequencer} sequencer The sequencer to process on event triggering.
                 */
                addListener: {
                    arguments: [
                        'string/name',
                        'object/event',
                        'danf:manipulation.sequencer/sequencer'
                    ]
                },
                /**
                 * Refresh listeners if needed.
                 *
                 * @param {object} data The data used to customize the refresh processing.
                 */
                refreshListeners: {
                    arguments: ['object/data']
                },
                /**
                 * Notify an event triggering.
                 *
                 * @param {string} name The name of the event.
                 * @param {mixed} data The data associated with the triggered event.
                 */
                notify: {
                    arguments: ['string/name', 'mixed/data']
                }
            },
            getters: {
                /**
                 * The identifier name of the notifier.
                 *
                 * @return {string} The name.
                 */
                name: 'string',
                /**
                 * The contract that an event should respect in the configuration.
                 *
                 * @return {object} The contract.
                 */
                contract: 'object'
            }

        }
    };
});