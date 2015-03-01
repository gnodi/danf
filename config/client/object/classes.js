'use strict';

define(function(require) {
    return {
        classProcessor: {
            extender: require('-/danf/lib/common/object/class-processor/extender'),
            interfacer: require('-/danf/lib/common/object/class-processor/interfacer')
        },
        classesHandler: require('-/danf/lib/common/object/classes-handler'),
        classesRegistry: require('-/danf/lib/common/object/classes-registry'),
        interfacesRegistry: require('-/danf/lib/common/object/interfaces-registry'),
        interfacer: require('-/danf/lib/common/object/interfacer'),
        configurationSection: {
            interfaces: require('-/danf/lib/common/object/configuration-section/interfaces'),
            classes: require('-/danf/lib/common/object/configuration-section/classes')
        }
    };
});