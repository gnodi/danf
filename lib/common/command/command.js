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
    this._options = {};
}

Command.defineImplementedInterfaces(['danf:command.command']);

/**
 * @interface {danf:command.command}
 */
Object.defineProperty(Command.prototype, 'name', {
    set: function(name) {
        this._name = name.replace(/[-]([^.])/g, function(match, p1) {
            return p1.toUpperCase();
        });
    },
    get: function() { return this._name; }
});

/**
 * @interface {danf:command.command}
 */
Object.defineProperty(Command.prototype, 'options', {
    set: function(options) { this._options = options; },
    get: function() { return this._options; }
});

/**
 * @interface {danf:command.command}
 */
Command.prototype.setOption = function(name, value) {
    this._options[name] = value;
}

/**
 * @interface {danf:command.command}
 */
Command.prototype.getOption = function(name) {
    return this._options[name];
}

/**
 * @interface {danf:command.command}
 */
Command.prototype.hasOption = function(name) {
    return undefined !== this._options[name];
}