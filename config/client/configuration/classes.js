'use strict';

define(function(require) {
    return {
        module: require('-/danf/lib/common/configuration/mod'),
        modulesTree: require('-/danf/lib/common/configuration/modules-tree'),
        namespacer: require('-/danf/lib/common/configuration/namespacer'),
        processor: require('-/danf/lib/common/configuration/processor'),
        sectionProcessor: require('-/danf/lib/common/configuration/section-processor'),
        dataInterpreter: {
            abstractNamespacer: require('-/danf/lib/common/configuration/data-interpreter/abstract-namespacer'),
            namespaces: require('-/danf/lib/common/configuration/data-interpreter/namespaces'),
            references: require('-/danf/lib/common/configuration/data-interpreter/references')
        },
        configurationSection: {
            parameters: require('-/danf/lib/common/configuration/configuration-section/parameters')
        }
    };
});