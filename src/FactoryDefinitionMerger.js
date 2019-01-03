'use strict';

const MissingImplementationError = require('./errors/MissingImplementation');

/**
 * @class FactoryDefinitionMerger
 */
class FactoryDefinitionMerger {
  /**
   * Merge merging definition with base definition.
   * In case of overwriting, merging definition win against base definition.
   * @param {Object} baseDefinition - The base definition.
   * @param {Object} mergingDefinition - The merging definition.
   * @returns {Object} The merged definition.
   */
  merge(baseDefinition, mergingDefinition) {
    throw MissingImplementationError(this, 'merge');
  }
}

module.exports = FactoryDefinitionMerger;