module.exports = {
    servicesContainer: require('../../../lib/common/dependency-injection/services-container'),
    contextProvider: require('../../../lib/common/dependency-injection/context-provider'),
    objectProvider: require('../../../lib/common/dependency-injection/object-provider'),
    serviceBuilder: {
        abstractServiceBuilder: require('../../../lib/common/dependency-injection/service-builder/abstract-service-builder'),
        abstract: require('../../../lib/common/dependency-injection/service-builder/abstract'),
        alias: require('../../../lib/common/dependency-injection/service-builder/alias'),
        children: require('../../../lib/common/dependency-injection/service-builder/children'),
        class: require('../../../lib/common/dependency-injection/service-builder/class'),
        declinations: require('../../../lib/common/dependency-injection/service-builder/declinations'),
        factories: require('../../../lib/common/dependency-injection/service-builder/factories'),
        parent: require('../../../lib/common/dependency-injection/service-builder/parent'),
        properties: require('../../../lib/common/dependency-injection/service-builder/properties'),
        tags: require('../../../lib/common/dependency-injection/service-builder/tags')
    },
    configuration: {
        sectionProcessor: {
            services: require('../../../lib/common/dependency-injection/configuration/section-processor/services')
        }
    }
};