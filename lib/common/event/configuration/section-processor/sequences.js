'use strict';

/**
 * Expose `Sequences`.
 */
module.exports = Sequences;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    SectionProcessor = require('../../../configuration/section-processor')
;

utils.extend(SectionProcessor, Sequences);

/**
 * Initialize a new section processor sequences for the config.
 *
 * @param {string} name The name of the section.
 * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 */
function Sequences(name, configurationResolver, referenceResolver, namespacer) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver, namespacer);
}

Sequences.defineDependency('_sequenceInterpreters', 'danf:event.sequenceInterpreter_array');

/**
 * Set the collection interpreter.
 *
 * @param {danf:event.collectionInterpreter} The collection interpreter.
 * @api public
 */
Object.defineProperty(Sequences.prototype, 'collectionInterpreter', {
    set: function(collectionInterpreter) {
        this._collectionInterpreter = collectionInterpreter
    }
});

/**
 * Set the sequence interpreters.
 *
 * @return {danf:event.notifier_array}
 * @api public
 */
Object.defineProperty(Sequences.prototype, 'sequenceInterpreters', {
    set: function(sequenceInterpreters) {
        this._sequenceInterpreters = [];

        for (var i = 0; i < sequenceInterpreters.length; i++) {
            this.addSequenceInterpreter(sequenceInterpreters[i]);
        }
    }
});

/**
 * Add a sequence interpreter.
 *
 * @param {danf:event.sequenceInterpreter} sequenceInterpreter The sequence interpreter.
 * @api public
 */
Sequences.prototype.addSequenceInterpreter = function(sequenceInterpreter) {
    this._sequenceInterpreters.push(sequenceInterpreter);
}

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Object.defineProperty(Sequences.prototype, 'contract', {
    get: function() {
        var contract = {
                __any: {},
                type: 'embedded',
                namespace: true,
                references: ['$']
            }
        ;

        for (var i = 0; i < this._sequenceInterpreters.length; i++) {
            contract.__any = utils.merge(contract.__any, this._sequenceInterpreters[i].contract);
        }

        return contract;
    },
    set: function(contract) { this._contract = contract; }
});