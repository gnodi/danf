'use strict';

/**
 * Expose `Events`.
 */
module.exports = Events;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    SectionProcessor = require('../../../configuration/section-processor')
;

/**
 * Initialize a new section processor events for the config.
 *
 * @param {string} name The name of the section.
 * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 * @param {danf:event.collectionInterpreter} The collection interpreter.
 */
function Events(name, configurationResolver, referenceResolver, namespacer, collectionInterpreter) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver, namespacer);

    this._notifiers = [];
}

utils.extend(SectionProcessor, Events);

Events.defineDependency('_collectionInterpreter', 'danf:event.collectionInterpreter');
Events.defineDependency('_notifiers', 'danf:event.notifier_array');

/**
 * Set the collection interpreter.
 *
 * @param {danf:event.collectionInterpreter} The collection interpreter.
 * @api public
 */
Object.defineProperty(Events.prototype, 'collectionInterpreter', {
    set: function(collectionInterpreter) {
        this._collectionInterpreter = collectionInterpreter
    }
});

/**
 * Set the notifiers.
 *
 * @return {danf:event.notifier_array}
 * @api public
 */
Object.defineProperty(Events.prototype, 'notifiers', {
    set: function(notifiers) {
        this._notifiers = [];

        for (var i = 0; i < notifiers.length; i++) {
            this.addNotifier(notifiers[i]);
        }
    }
});

/**
 * Add a notifier.
 *
 * @param {danf:event.notifier} notifier The notifier.
 * @api public
 */
Events.prototype.addNotifier = function(notifier) {
    this._notifiers.push(notifier);
}

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Object.defineProperty(Events.prototype, 'contract', {
    get: function() {
        var contract = {};

        for (var i = 0; i < this._notifiers.length; i++) {
            var notifier = this._notifiers[i],
                notifierContract = notifier.contract
            ;

            Object.checkType(notifierContract, 'object');

            notifierContract.sequences = {
                type: 'embedded_array',
                embed: {
                    name: {
                        type: 'string',
                        required: true,
                        namespace: true
                    },
                    condition: {
                        type: 'function'
                    },
                    order: {
                        type: 'number',
                        default: 0
                    },
                    collection: {
                        type: 'embedded',
                        embed: this._collectionInterpreter.contract
                    },
                    input: {
                        type: 'mixed_object',
                        default: {}
                    },
                    output: {
                        type: 'mixed_object',
                        default: {}
                    }
                }
            };

            notifierContract.parameters = {
                type: 'mixed_object'
            };

            contract[notifier.name] = {
                type: 'embedded_object',
                embed: notifierContract,
                namespace: true,
                references: ['$']
            };
        }

        return contract;
    },
    set: function(contract) { this._contract = contract; }
});