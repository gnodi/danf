module.exports = {
    module: require('../../../configuration/mod'),
    modulesTree: require('../../../configuration/modules-tree'),
    namespacer: require('../../../configuration/namespacer'),
    processor: require('../../../configuration/processor'),
    sectionProcessor: require('../../../configuration/section-processor'),
    dataInterpreter: {
        abstractNamespacer: require('../../../configuration/data-interpreter/abstract-namespacer'),
        namespaces: require('../../../configuration/data-interpreter/namespaces'),
        references: require('../../../configuration/data-interpreter/references')
    },
    configurationSection: {
        parameters: require('../../../configuration/configuration-section/parameters')
    }
};