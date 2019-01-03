'use strict';

const helper = Symbol('helper');

/**
 * @class Composer
 */
class Composer {
  /**
   * Helper.
   * @type {Object}
   * @throws {TypeError} On unexpected value.
   */
  set helper(value) {
    if (typeof value !== 'object') {
      throw new BadTypeError(value, 'an helper');
    }

    this[helper] = value;
}

  /**
   * Compose a configuration block.
   * @param {Object|Function|Array<Object|Function>} configuration -
   *   The configuration or function returning configuration or array of both.
   * @param {string} [namespace=''] - The optional namespace.
   * @returns {Object<string,Object>} The composed configuration.
   */
  compose(configuration, namespace = '') {
    let config = configuration;

    if (configuration instanceof Array) {
      config = config.reduce((map, item) => {
        return Object.assign({}, map, this.compose(item));
      }, {});
    } else if (configuration instanceof Function) {
      config = this.compose(configuration(this[helper]));
    }

    return namespace ? [{namespace}: config] : config;
  }
}

module.exports = Composer;
