'use strict';

/**
 * Expose `Parents`.
 */
module.exports = Parents;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Embedded = require('./embedded')
;

/**
 * Initialize a new parents sequence interpreter.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 * @param {danf:event.referencesResolver} The references resolver.
 * @param {danf:event.collectionInterpreter} The collection interpreter.
 */
function Parents(sequencesContainer, referencesResolver, collectionInterpreter) {
    Embedded.call(this, sequencesContainer, referencesResolver, collectionInterpreter);

    this._order = 1400;
}

utils.extend(Embedded, Parents);

/**
 * Get the embedded name.
 *
 * @return {string}
 * @api protected
 */
Object.defineProperty(Parents.prototype, 'embeddedName', {
    value: 'parents'
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Parents.prototype.interpret = function(interpretation, definition, context) {
    if (definition.parents) {
        for (var i = 0; i < definition.parents.length; i++) {
            var operations = [],
                parent = definition.parents[i],
                order = parent.order,
                names = this._referencesResolver.resolveSpecific(
                    parent.name,
                    '&',
                    context.collections
                )
            ;

            if ('string' === typeof names) {
                names = [names];
            }

            for (var k = 0; k < names.length; k++) {
                var parentInterpretation = this._sequencesContainer.getInterpretation(names[k]);

                for (var j = 0; j < parentInterpretation.length; j++) {
                    if (parentInterpretation[j].order === order) {
                        operations = parentInterpretation[j].operations;
                        break;
                    } else if (parentInterpretation[j].order > order) {
                        break;
                    }
                }

                if (0 === operations.length) {
                    if (j === operations.length - 1) {
                        parentInterpretation.push(
                            {
                                order: order,
                                operations: operations
                            }
                        );
                    } else {
                        parentInterpretation.splice(
                            j,
                            0,
                            {
                                order: order,
                                operations: operations
                            }
                        );
                    }
                }

                operations.push(interpretParent.call(this, parent, definition.id));
            }
        }
    }

    return interpretation;
}

/**
 * Interpret a parent.
 *
 * @param {object} parent The definition of the parent sequence.
 * @param {string} id The identifier of the sequence.
 * @return {function} The interpreted parent.
 */
var interpretParent = function(parent, id) {
    return this.interpretEmbedded(parent, id);
}
