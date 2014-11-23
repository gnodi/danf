'use strict';

define(function(require) {
    return {
        classes: {
            classProcessor: {
                extender: require('danf/object/class-processor/extender'),
                interfacer: require('danf/object/class-processor/interfacer')
            },
            classesHandler: require('danf/object/classes-handler'),
            classesIndexer: require('danf/object/classes-indexer'),
            interfacesIndexer: require('danf/object/interfaces-indexer'),
            interfacer: require('danf/object/interfacer'),
            configurationSection: {
                interfaces: require('danf/object/configuration-section/interfaces'),
                classes: require('danf/object/configuration-section/classes')
            }
        }
    };
});