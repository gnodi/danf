'use strict';

module.exports = {
    classesContainer: require('../../../lib/common/object/classes-container'),
    'interface': require('../../../lib/common/object/interface'),
    interfacesContainer: require('../../../lib/common/object/interfaces-container'),
    interfacer: require('../../../lib/common/object/interfacer'),
    classProcessor: {
        abstract: require('../../../lib/common/object/class-processor/abstract'),
        extender: require('../../../lib/common/object/class-processor/extender'),
        interfacer: require('../../../lib/common/object/class-processor/interfacer')
    },
    configuration: {
        sectionProcessor: {
            interfaces: require('../../../lib/common/object/configuration/section-processor/interfaces'),
            classes: require('../../../lib/common/object/configuration/section-processor/classes')
        }
    }
};