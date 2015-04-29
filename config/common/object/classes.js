'use strict';

module.exports = {
    class: require('../../../lib/common/object/class'),
    classesHandler: require('../../../lib/common/object/classes-handler'),
    classesRegistry: require('../../../lib/common/object/classes-registry'),
    interfacesRegistry: require('../../../lib/common/object/interfaces-registry'),
    interfacer: require('../../../lib/common/object/interfacer'),
    classProcessor: {
        extender: require('../../../lib/common/object/class-processor/extender'),
        interfacer: require('../../../lib/common/object/class-processor/interfacer'),
        asynchronizer: require('../../../lib/common/object/class-processor/asynchronizer')
    },
    configuration: {
        sectionProcessor: {
            interfaces: require('../../../lib/common/object/configuration/section-processor/interfaces'),
            classes: require('../../../lib/common/object/configuration/section-processor/classes')
        }
    }
};