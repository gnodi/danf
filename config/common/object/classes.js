'use strict';

module.exports = {
    classesHandler: require('../../../lib/common/object/classes-handler'),
    classesRegistry: require('../../../lib/common/object/classes-registry'),
    interfacesRegistry: require('../../../lib/common/object/interfaces-registry'),
    interfacer: require('../../../lib/common/object/interfacer'),
    classProcessor: {
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