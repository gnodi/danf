'use strict';

/**
 * @class Builder
 */
class Builder {
  /**
   * Build services.
   * @param {Array<Object>} configurations - The configuration list.
   * @param {?Array} [facade=null] - The name of the services constituting the interface.
   * @returns {Container|Object<string,Object>} The container if 'facade' is null,
   *   the interface services otherwise.
   */
  build(configurations, facade = null) {
    const container = nead.createContainer();

    configurations.forEach((item) => {
      if (item instanceof Array) {
        container.compose(item[0], item[1]);
      } else {
        container.createSet(item);
      }
    });

    container.build();

    if (facade) {
      return facade.reduce((map, service) => {
        map[service] = container.get(service);
        return map;
      }, {});
    }

    return container;
  }
}

module.exports = Builder;
