module.exports = {
    module: require('../../../lib/common/configuration/mod'),
    modulesTree: require('../../../lib/common/configuration/modules-tree'),
    namespacer: require('../../../lib/common/configuration/namespacer'),
    processor: require('../../../lib/common/configuration/processor'),
    sectionProcessor: require('../../../lib/common/configuration/section-processor'),
    dataInterpreter: {
        abstractNamespacer: require('../../../lib/common/configuration/data-interpreter/abstract-namespacer'),
        namespaces: require('../../../lib/common/configuration/data-interpreter/namespaces'),
        references: require('../../../lib/common/configuration/data-interpreter/references')
    },
    configurationSection: {
        parameters: require('../../../lib/common/configuration/configuration-section/parameters')
    }
};