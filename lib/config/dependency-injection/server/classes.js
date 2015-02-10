module.exports = {
    servicesContainer: require('../../../dependency-injection/services-container'),
    contextProvider: require('../../../dependency-injection/context-provider'),
    objectProvider: require('../../../dependency-injection/object-provider'),
    serviceBuilder: {
        abstractServiceBuilder: require('../../../dependency-injection/service-builder/abstract-service-builder'),
        abstract: require('../../../dependency-injection/service-builder/abstract'),
        alias: require('../../../dependency-injection/service-builder/alias'),
        children: require('../../../dependency-injection/service-builder/children'),
        class: require('../../../dependency-injection/service-builder/class'),
        declinations: require('../../../dependency-injection/service-builder/declinations'),
        factories: require('../../../dependency-injection/service-builder/factories'),
        parent: require('../../../dependency-injection/service-builder/parent'),
        properties: require('../../../dependency-injection/service-builder/properties'),
        tags: require('../../../dependency-injection/service-builder/tags')
    },
    configurationSection: {
        services: require('../../../dependency-injection/configuration-section/services')
    }
};