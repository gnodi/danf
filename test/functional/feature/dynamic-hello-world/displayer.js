'use strict';

/**
 * Expose `Displayer`.
 */
module.exports = Displayer;

/**
 * Initialize a new displayer.
 */
function Displayer() {}

Displayer.defineImplementedInterfaces(['displayer']);

Displayer.defineDependency('_jquery', 'function');

/**
 * Set jquery.
 *
 * @param {object}
 * @api public
 */
Object.defineProperty(Displayer.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {displayer}
 */
Displayer.prototype.display = function() {
    var $ = this._jquery;

    $('title').text('Hello World!');
    $('body').html('<p>Hello World!</p>');
}