'use strict';

/**
 * Expose `Children`.
 */
module.exports = Children;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new children service builder.
 */
function Children() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 1600;

    this._children = {};
    this._handleChildren = false;
}

utils.extend(AbstractServiceBuilder, Children);

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Children.prototype, 'contract', {
    get: function () {
        var buildRecursiveContract = function(contract, level) {
                var recursiveContract = {
                    type: 'embedded_object',
                    embed: utils.clone(contract)
                };

                if (level >= 1) {
                    recursiveContract.embed.children = buildRecursiveContract(contract, --level);
                }

                return recursiveContract;
            }
        ;

        return {
            children: function(contract) {
                var interpretedContract = {};

                for (var key in contract) {
                    if ('function' === typeof contract[key] && 'children' !== key) {
                        interpretedContract[key] = contract[key](contract);
                    } else {
                        interpretedContract[key] = contract[key];
                    }
                }

                return buildRecursiveContract(interpretedContract, 4);
            }
        };
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Children.prototype.resolve = function(definition) {
    if (definition.children) {
        definition.abstract = true;

        if ('object' !== typeof definition.children) {
            throw new Error(
                'The children parameter of the service "{0}" should be an object of service definitions.'.format(
                    definition.id
                )
            );
        }

        for (var key in definition.children) {
            var child = definition.children[key],
                childService = this._servicesContainer.mergeDefinitions(definition, child)
            ;

            childService.children = child.children;
            childService.parent = child.parent ? child.parent : definition.parent;
            childService.abstract = !child.abstract ? false : true;
            childService.id = '{0}.{1}'.format(definition.id, key);

            this._children[childService.id] = childService;
        }
    }

    return definition;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Children.prototype.define = function(definition) {
    if (!this._handleChildren && this._children) {
        this._handleChildren = true;

        for (var id in this._children) {
            this._servicesContainer.setDefinition(id, this._children[id]);
            delete this._children[id];
        }

        this._handleChildren = false;
    }

    return definition;
}