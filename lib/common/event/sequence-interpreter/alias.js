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
 * Initialize a new alias sequence interpreter.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 */
function Alias(sequencesContainer) {
    Abstract.call(this, sequencesContainer);

    this._order = 600;
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
Alias.prototype.interpret = function(interpretation, definition, context) {
    if (definition.alias) {
        for (var parameter in definition) {
            if (!(parameter in {alias: true, id: true})
                && undefined !== definition[parameter]
            ) {
                throw new Error(
                    'The definition for "{0}" is an alias of the sequence "{1}" and cannot define another parameter.'.format(
                        definition.id,
                        definition.alias
                    )
                );
            }
        }
    }

    this._sequencesContainer.setAlias(definition.id, definition.alias);

    return interpretation;
}
