'use strict';

/**
 * Expose `Links`.
 */
module.exports = Links;

/**
 * Initialize a new ajax links ready processor.
 */
function Links() {
}

Links.defineImplementedInterfaces(['danf:ajaxApp.processor']);

/**
 * Set the links handler.
 *
 * @param {danf.ajaxApp.linksHandler}
 * @api public
 */
Object.defineProperty(Links.prototype, 'linksHandler', {
    set: function(linksHandler) { this._linksHandler = linksHandler; }
});

/**
 * @interface {danf:ajaxApp.processor}
 */
Links.prototype.process = function(event, data) {
    this._linksHandler.load(data.scope);
}