'use strict';

/**
 * Expose `Dumb`.
 */
module.exports = Dumb;

/**
 * Initialize a new dumb category computer.
 */
function Dumb() {
}

// Define the implemented interfaces.
Dumb.defineExtendedClass('categoryComputer.abstract');

/**
 * @inheritdoc
 */
Dumb.prototype.computeBoost = function() {
    return this._boost * 3;
}