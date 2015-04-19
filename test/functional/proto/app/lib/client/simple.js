// Use (https://github.com/gnodi/danf/blob/master/resource/private/doc/use/object.md):
'use strict';

/**
 * Expose `Simple`.
 */
module.exports = Simple;

/**
 * Initialize a new simple.
 */
function Simple() {
}

Simple.defineImplementedInterfaces(['simple']);

ListDisplayer.defineDependency('_foo', 'number');
ListDisplayer.defineDependency('_bar', 'string_array');

/**
 * Set foo.
 *
 * @param {number}
 * @api public
 */
Object.defineProperty(ListDisplayer.prototype, 'foo', {
    set: function(foo) { this._foo = foo; }
});

/**
 * Set bar.
 *
 * @param {string_array}
 * @api public
 */
Object.defineProperty(ListDisplayer.prototype, 'bar', {
    set: function(bar) { this._bar = bar; }
});

/**
 * @interface {simple}
 */
Simple.prototype.initialize = function(foo, bar) {
    this.foo = foo;
    this.bar = bar;
}