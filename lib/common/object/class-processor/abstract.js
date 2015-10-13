'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Module dependencies.
 */
var utils = require('../../utils');

/**
 * Initialize a new abstract class processor.
 */
function Abstract() {
}

Abstract.defineImplementedInterfaces(['danf:object.classProcessor']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_classesContainer', 'danf:object.classesContainer');

/**
 * Set the classes container.
 *
 * @param {danf:object.classesContainer} classesContainer The classes container.
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'classesContainer', {
    set: function(classesContainer) { this._classesContainer = classesContainer; }
});