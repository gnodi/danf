'use strict';

/**
 * @class MissingImplementationError
 */
module.exports = class MissingImplementationError extends Error {
  /**
   * Constructor.
   * @constructs
   * @param {Object} object - The object.
   * @param {string} method - The method name.
   */
  constructor(object, method) {
    super(`'${method}' method must be implemented by '${object.constructor.name}'`);

    this.name = 'NeadMissingImplementationError';
  }
};
