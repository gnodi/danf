'use strict';

module.exports = {
    servicesContainer: require('../../../lib/common/dependency-injection/services-container'),
    objectProvider: require('../../../lib/common/dependency-injection/object-provider'),
    registry: require('../../../lib/common/dependency-injection/registry'),
    serviceBuilder: {
        abstractServiceBuilder: require('../../../lib/common/dependency-injection/service-builder/abstract-service-builder'),
        abstract: require('../../../lib/common/dependency-injection/service-builder/abstract'),
        alias: require('../../../lib/common/dependency-injection/service-builder/alias'),
        children: require('../../../lib/common/dependency-injection/service-builder/children'),
        class: require('../../../lib/common/dependency-injection/service-builder/class'),
        collections: require('../../../lib/common/dependency-injection/service-builder/collections'),
        declinations: require('../../../lib/common/dependency-injection/service-builder/declinations'),
        induced: require('../../../lib/common/dependency-injection/service-builder/induced'),
        factories: require('../../../lib/common/dependency-injection/service-builder/factories'),
        parent: require('../../../lib/common/dependency-injection/service-builder/parent'),
        properties: require('../../../lib/common/dependency-injection/service-builder/properties')
    },
    configuration: {
        sectionProcessor: {
            services: require('../../../lib/common/dependency-injection/configuration/section-processor/services')
        }
    }
};