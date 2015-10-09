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
 */
function Events() {
    SectionProcessor.call(this);

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
        var self = this,
            contract = {}
        ;

        for (var i = 0; i < this._notifiers.length; i++) {
            (function(i) {
                var notifier = self._notifiers[i],
                    notifierContract = notifier.contract
                ;

                Object.checkType(notifierContract, 'object');

                // Add sequences section.
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
                            embed: self._collectionInterpreter.contract
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

                // Add default data contract section if not already defined.
                if (null == notifierContract.data) {
                    notifierContract.data = {
                        type: 'object'
                    };
                }

                var currentContract = utils.clone(notifierContract),
                    builtContract = currentContract
                ;

                for (var i = 0; i <= 9; i++) {
                    currentContract.children = {
                        type: 'embedded_object',
                        embed: utils.clone(notifierContract)
                    };

                    currentContract = currentContract.children.embed;
                }

                contract[notifier.name] = {
                    type: 'embedded_object',
                    embed: builtContract,
                    namespace: true,
                    references: ['$'],
                    validate: function(value) {
                        var definitions = {};

                        for (var key in value) {
                            var itemDefinitions = mergeChildren(key, value[key], notifier);

                            for (var name in itemDefinitions) {
                                definitions[name] = itemDefinitions[name];
                            }
                        }

                        return definitions;
                    }
                };
            })(i);
        }

        return contract;
    },
    set: function(contract) { this._contract = contract; }
});

/**
 * Merge children definitions with parent one.
 *
 * @param {string} name The name of the definition.
 * @param {object} parent The parent definition.
 * @param {danf:event.notifier} notifier The event notifier.
 * @return {object} The merged definitions.
 * @api private
 */
var mergeChildren = function(name, parent, notifier) {
    var children = parent.children,
        definitions = {}
    ;
console.log('_________', name, children);
    if (children) {
        for (var childName in children) {
            var child = children[childName],
                childDefinitions = mergeChildren(childName, child, notifier);
            ;

            for (var childName in childDefinitions) {
                definitions['{0}.{1}'.format(name, childName)] = childDefinitions[childName];
            }
        }

        for (var childName in definitions) {
            var child = definitions[childName];

            for (var key in child) {
                child[key] = notifier.mergeContractField(key, utils.clone(parent[key]), child[key]);
            }
        }
    } else {
        definitions[name] = parent;
    }
console.log('-----------',definitions);
    return definitions;
}