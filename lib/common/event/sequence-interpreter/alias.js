'use strict';

/**
 * Expose `Alias`.
 */
module.exports = Alias;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new alias sequence builder.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 */
function Alias(sequencesContainer, referenceResolver) {
    Abstract.call(this, sequencesContainer, referenceResolver);

    this._interpretationOrder = 600;
}

utils.extend(Abstract, Alias);

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Alias.prototype, 'contract', {
    value: {
        alias: {
            type: 'string',
            namespaces: true
        }
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Alias.prototype.interpret = function(sequence) {
    if (sequence.alias) {
        for (var parameter in sequence) {
            if (!(parameter in {alias: true, id: true})
                && undefined !== sequence[parameter]
            ) {
                throw new Error(
                    'The definition for "{0}" is an alias of the sequence "{1}" and cannot define another parameter.'.format(
                        sequence.id,
                        sequence.alias
                    )
                );
            }
        }
    }

    this._sequencesContainer.setAlias(sequence.id, sequence.alias);

    return sequence;
}
