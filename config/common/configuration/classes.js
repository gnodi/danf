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
            namespace: require('../../../lib/common/configuration/manipulation/data-interpreter/namespace'),
            references: require('../../../lib/common/configuration/manipulation/data-interpreter/references')
        }
    },
    'sectionProcessor.parameters': require('../../../lib/common/configuration/section-processor/parameters')
};