'use strict';

module.exports = {
    classes: {
        classProcessor: {
            extender: require('../../../object/class-processor/extender'),
            interfacer: require('../../../object/class-processor/interfacer')
        },
        classesHandler: require('../../../object/classes-handler'),
        classesIndexer: require('../../../object/classes-indexer'),
        interfacesIndexer: require('../../../object/interfaces-indexer'),
        interfacer: require('../../../object/interfacer'),
        configurationSection: {
            interfaces: require('../../../object/configuration-section/interfaces'),
            classes: require('../../../object/configuration-section/classes')
        }
    }
};