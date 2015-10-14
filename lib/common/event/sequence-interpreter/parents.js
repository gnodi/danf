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
 */
function Parents() {
    Embedded.call(this);

    this._order = 1400;
}

utils.extend(Embedded, Parents);

/**
 * Embedded name.
 *
 * @var {string}
 * @api protected
 */
Object.defineProperty(Parents.prototype, 'embeddedName', {
    value: 'parents'
});

/**
 * Specific contract.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(Parents.prototype, 'specificContract', {
    value: {
        target: {
            type: 'string',
            required: true,
            namespace: true
        }
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Parents.prototype.interpret = function(interpretation, definition, context) {
    if (definition.parents) {
        for (var i = 0; i < definition.parents.length; i++) {
            var parent = definition.parents[i],
                order = parent.order || 0,
                targets = parent.target
            ;

            if (-1 !== targets.indexOf('&'))
                targets = this._referencesResolver.resolveSpecific(
                    '&{0}&'.format(targets.replace(/&/g, '')),
                    '&',
                    context.collections
                )
            ;

            if ('string' === typeof targets) {
                targets = [targets];
            }

            for (var k = 0; k < targets.length; k++) {
                var operations = [],
                    parentInterpretation = this._sequencesContainer.getInterpretation(targets[k])
                ;

                for (var j = 0; j < parentInterpretation.length; j++) {
                    if (null != parentInterpretation[j].order) {
                        if (parentInterpretation[j].order === order) {
                            operations = parentInterpretation[j].operations;
                            break;
                        } else if (parentInterpretation[j].order > order) {
                            break;
                        }
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
