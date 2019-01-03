'use strict';

/**
 * @class BadTypeError
 */
module.exports = class BadTypeError extends TypeError {
  /**
   * Constructor.
   * @constructs
   * @param {*} value - The value.
   * @param {string} expected - The expected value type.
   */
  constructor(value, expected) {
    super(`Expected ${expected}, got ${typeof value} instead`);

    this.name = 'NeadBadTypeError';
  }
};
