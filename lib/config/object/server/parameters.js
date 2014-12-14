'use strict';

module.exports = {
    classes: {
        classProcessor: {
            extender: require('../../../object/class-processor/extender'),
            interfacer: require('../../../object/class-processor/interfacer')
        },
        classesHandler: require('../../../object/classes-handler'),
        classesRegistry: require('../../../object/classes-registry'),
        interfacesRegistry: require('../../../object/interfaces-registry'),
        interfacer: require('../../../object/interfacer'),
        configurationSection: {
            interfaces: require('../../../object/configuration-section/interfaces'),
            classes: require('../../../object/configuration-section/classes')
        }
    }
};