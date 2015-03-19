'use strict';

module.exports = {
    module: require('../../../lib/common/configuration/mod'),
    modulesTree: require('../../../lib/common/configuration/modules-tree'),
    namespacer: require('../../../lib/common/configuration/namespacer'),
    processor: require('../../../lib/common/configuration/processor'),
    sectionProcessor: require('../../../lib/common/configuration/section-processor'),
    manipulation: {
        dataInterpreter: {
            abstractNamespacer: require('../../../lib/common/configuration/manipulation/data-interpreter/abstract-namespacer'),
            namespaces: require('../../../lib/common/configuration/manipulation/data-interpreter/namespaces'),
            references: require('../../../lib/common/configuration/manipulation/data-interpreter/references')
        }
    },
    "sectionProcessor.parameters": require('../../../lib/common/configuration/section-processor/parameters')
};