'use strict';

define(function(require) {
    return {
        module: require('-/danf/lib/common/configuration/mod'),
        modulesTree: require('-/danf/lib/common/configuration/modules-tree'),
        namespacer: require('-/danf/lib/common/configuration/namespacer'),
        processor: require('-/danf/lib/common/configuration/processor'),
        sectionProcessor: require('-/danf/lib/common/configuration/section-processor'),
        manipulation: {
            dataInterpreter: {
                abstractNamespacer: require('-/danf/lib/common/configuration/manipulation/data-interpreter/abstract-namespacer'),
                namespaces: require('-/danf/lib/common/configuration/manipulation/data-interpreter/namespaces'),
                references: require('-/danf/lib/common/configuration/manipulation/data-interpreter/references')
            }
        },
        "sectionProcessor.parameters": require('-/danf/lib/common/configuration/section-processor/parameters')
    };
});