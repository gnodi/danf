'use strict';

/**
 * Expose `Command`.
 */
module.exports = Command;

/**
 * Initialize a new command.
 */
function Command() {
    this._name = '';
    this._parameters = {};
}

Command.defineImplementedInterfaces(['danf:command.command']);

/**
 * @interface {danf:command.command}
 */
Object.defineProperty(Command.prototype, 'name', {
    set: function(name) { this._name = name; },
    get: function() { return this._name; }
});

/**
 * @interface {danf:command.command}
 */
Object.defineProperty(Command.prototype, 'parameters', {
    set: function(parameters) { this._parameters = parameters; },
    get: function() { return this._parameters; }
});

/**
 * @interface {danf:command.command}
 */
Command.prototype.setParameter = function(name, value) {
    this._parameters[name] = value;
}

/**
 * @interface {danf:command.command}
 */
Command.prototype.getParameter = function(name) {
    return this._parameters[name];
}

/**
 * @interface {danf:command.command}
 */
Command.prototype.hasParameter = function(name) {
    return undefined !== this._parameters[name];
}