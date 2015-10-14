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
 * Classes container.
 *
 * @var {danf:object.classesContainer}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'classesContainer', {
    set: function(classesContainer) { this._classesContainer = classesContainer; }
});