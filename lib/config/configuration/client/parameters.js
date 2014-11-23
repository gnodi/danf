'use strict';

define(function(require) {
    return {
        classes: {
            module: require('danf/configuration/mod'),
            modulesTree: require('danf/configuration/modules-tree'),
            namespacer: require('danf/configuration/namespacer'),
            processor: require('danf/configuration/processor'),
            sectionProcessor: require('danf/configuration/section-processor'),
            dataInterpreter: {
                abstractNamespacer: require('danf/configuration/data-interpreter/abstract-namespacer'),
                namespaces: require('danf/configuration/data-interpreter/namespaces'),
                references: require('danf/configuration/data-interpreter/references')
            },
            configurationSection: {
                parameters: require('danf/configuration/configuration-section/parameters')
            }
        }
    };
});