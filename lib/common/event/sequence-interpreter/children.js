'use strict';

/**
 * Expose `Children`.
 */
module.exports = Children;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Embedded = require('./embedded')
;

/**
 * Initialize a new children sequence interpreter.
 */
function Children() {
    Embedded.call(this);

    this._order = 1200;
}

utils.extend(Embedded, Children);

/**
 * Get the embedded name.
 *
 * @return {string}
 * @api protected
 */
Object.defineProperty(Children.prototype, 'embeddedName', {
    value: 'children'
});

/**
 * Get specific contract.
 *
 * @return {object}
 * @api protected
 */
Object.defineProperty(Children.prototype, 'specificContract', {
    value: {
        name: {
            type: 'string',
            required: true,
            namespace: true
        }
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Children.prototype.interpret = function(interpretation, definition, context) {
    if (definition.children) {
        for (var i = 0; i < definition.children.length; i++) {
            var operations = [],
                child = definition.children[i],
                order = child.order || 0
            ;

            for (var j = 0; j < interpretation.length; j++) {
                if (null != interpretation[j].order) {
                    if (interpretation[j].order === order) {
                        operations = interpretation[j].operations;
                        break;
                    } else if (interpretation[j].order > order) {
                        break;
                    }
                }
            }

            if (0 === operations.length) {
                if (j === operations.length - 1) {
                    interpretation.push(
                        {
                            order: order,
                            operations: operations
                        }
                    );
                } else {
                    interpretation.splice(
                        j,
                        0,
                        {
                            order: order,
                            operations: operations
                        }
                    );
                }
            }

            operations.push(interpretChild.call(this, child));
        }
    }

    return interpretation;
}

/**
 * Interpret a child.
 *
 * @param {object} child The definition of the child.
 * @return {function} The interpreted child.
 */
var interpretChild = function(child) {
    return this.interpretEmbedded(child, child.name);
}
