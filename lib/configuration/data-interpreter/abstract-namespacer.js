'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../../utils'),
        Abstract = module.isClient ? require('danf/manipulation/data-interpreter/abstract') : require('../../manipulation/data-interpreter/abstract')
    ;

    /**
     * Initialize a new section interpreter abstract namespacer for the config.
     *
     * @param {danf:configuration.namespacer} namespacer The namespacer.
     */
    function AbstractNamespacer(namespacer) {
        Abstract.call(this);

        if (namespacer) {
            this.namespacer = namespacer;
        }
    }

    AbstractNamespacer.defineAsAbstract();

    AbstractNamespacer.defineDependency('_namespacer', 'danf:configuration.namespacer');

    utils.extend(Abstract, AbstractNamespacer);

    /**
     * Set the namespacer.
     *
     * @param {danf:configuration.namespacer} namespacer The namespacer.
     * @api public
     */
    Object.defineProperty(AbstractNamespacer.prototype, 'namespacer', {
        set: function(namespacer) {
            this._namespacer = namespacer;
        }
    });

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Object.defineProperty(AbstractNamespacer.prototype, 'contract', {
        value: {
            __any: {
                methods: {
                    type: 'embedded_object',
                    embed: {
                        arguments: {
                            type: 'string_object',
                            default: []
                        },
                        returns: {
                            type: 'string'
                        }
                    }
                },
                getters: {
                    type: 'string_object'
                },
                setters: {
                    type: 'string_object'
                }
            },
            type: 'embedded'
        }
    });

    /**
     * Expose `AbstractNamespacer`.
     */
    return AbstractNamespacer;
});