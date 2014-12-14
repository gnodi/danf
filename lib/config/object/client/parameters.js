'use strict';

define(function(require) {
    return {
        classes: {
            classProcessor: {
                extender: require('danf/object/class-processor/extender'),
                interfacer: require('danf/object/class-processor/interfacer')
            },
            classesHandler: require('danf/object/classes-handler'),
            classesRegistry: require('danf/object/classes-registry'),
            interfacesRegistry: require('danf/object/interfaces-registry'),
            interfacer: require('danf/object/interfacer'),
            configurationSection: {
                interfaces: require('danf/object/configuration-section/interfaces'),
                classes: require('danf/object/configuration-section/classes')
            }
        }
    };
});