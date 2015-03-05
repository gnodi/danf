'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('-/danf/utils') : require('../../../utils'),
        SectionProcessor = module.isClient ? require('-/danf/lib/common/configuration/section-processor') : require('../../configuration/section-processor')
    ;

    /**
     * Initialize a new section processor events for the config.
     *
     * @param {string} name The name of the section.
     * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
     * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
     * @param {danf:configuration.namespacer} namespacer The namespacer.
     */
    function Events(name, configurationResolver, referenceResolver, namespacer) {
        SectionProcessor.call(this, name, null, configurationResolver, referenceResolver, namespacer);

        this._notifiers = [];
    }

    utils.extend(SectionProcessor, Events);

    Events.defineDependency('_notifiers', 'danf:event.notifier_array');

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
                    type: 'string_array',
                    default: [],
                    namespaces: true
                };

                notifierContract.contract = {
                    type: 'mixed_object'
                };

                contract[notifier.name] = {
                    type: 'embedded_object',
                    embed: notifierContract,
                    namespaces: true,
                    references: ['$']
                };
            }

            return contract;
        },
        set: function(contract) { this._contract = contract; }
    });

    /**
     * Expose `Events`.
     */
    return Events;
});