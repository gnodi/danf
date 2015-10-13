'use strict';

/**
 * Expose `InterfacesContainer`.
 */
module.exports = InterfacesContainer;

/**
 * Module dependencies.
 */
var utils = require('../utils'),
    Interface = require('./interface')
;

/**
 * Initialize a new interfaces container.
 */
function InterfacesContainer() {
    this._definitions = {};
    this._interfaces = {};
}

InterfacesContainer.defineImplementedInterfaces(['danf:object.interfacesContainer', 'danf:manipulation.registryObserver']);

/**
 * @interface {danf:manipulation.registryObserver}
 */
InterfacesContainer.prototype.handleRegistryChange = function(items, reset, name) {
    if (!reset) {
        for (var id in items) {
           this.setDefinition(id, items[id]);
        }
    } else {
        for (var id in items) {
           delete this._definitions[id];
           delete this._interfaces[id];
        }
    }

    this.build();
}

/**
 * @interface {danf:object.interfacesContainer}
 */
InterfacesContainer.prototype.setDefinition = function(id, definition) {
    definition.id = id;

    this._definitions[id] = definition;
}

/**
 * @interface {danf:object.interfacesContainer}
 */
InterfacesContainer.prototype.getDefinition = function(id) {
    if (!this.hasDefinition(id)) {
        throw new Error(
            'The interface "{0}" is not defined.'.format(id)
        );
    }

    return this._definitions[id];
}

/**
 * @interface {danf:object.interfacesContainer}
 */
InterfacesContainer.prototype.hasDefinition = function(id) {
    return this._definitions[id] ? true : false;
}

/**
 * @interface {danf:object.interfacesContainer}
 */
InterfacesContainer.prototype.build = function() {
    // Build.
    for (var id in this._definitions) {
        if (!this.has(id)) {
            this._interfaces[id] = this.get(id);
        }
    }
}

/**
 * @interface {danf:object.interfacesContainer}
 */
InterfacesContainer.prototype.get = function(id) {
    if (!this.has(id)) {
        var definition = this.getDefinition(id);

        this._interfaces[id] = processInterface.call(this, definition);
    }

    return this._interfaces[id];
}

/**
 * @interface {danf:object.interfacesContainer}
 */
InterfacesContainer.prototype.has = function(id) {
    return this._interfaces[id] ? true : false;
}

/**
 * Process an interface.
 *
 * @param {object} definition The definition of the interface.
 * @return {danf:object.interface} The interface.
 * @api private
 */
var processInterface = function(definition) {
    var methods = definition.methods || {},
        getters = definition.getters || {},
        setters = definition.setters || {}
    ;

    if (definition.extends) {
        var parentInterface = processInterface.call(this, this.get(definition.extends));

        methods = utils.merge(parentInterface.methods, methods);
        getters = utils.merge(parentInterface.getters, getters);
        setters = utils.merge(parentInterface.setters, setters);
    }

    var interface_ = new Interface();

    interface_.name = definition.id;
    interface_.extends = definition.extends;
    interface_.methods = methods;
    interface_.getters = getters;
    interface_.setters = setters;

    return interface_;
}