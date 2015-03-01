'use strict';

define(function(require) {
    return {
        servicesContainer: require('-/danf/lib/common/dependency-injection/services-container'),
        contextProvider: require('-/danf/lib/common/dependency-injection/context-provider'),
        objectProvider: require('-/danf/lib/common/dependency-injection/object-provider'),
        serviceBuilder: {
            abstractServiceBuilder: require('-/danf/lib/common/dependency-injection/service-builder/abstract-service-builder'),
            abstract: require('-/danf/lib/common/dependency-injection/service-builder/abstract'),
            alias: require('-/danf/lib/common/dependency-injection/service-builder/alias'),
            children: require('-/danf/lib/common/dependency-injection/service-builder/children'),
            class: require('-/danf/lib/common/dependency-injection/service-builder/class'),
            declinations: require('dan/lib/common/dependency-injection/service-builder/declinations'),
            factories: require('-/danf/lib/common/dependency-injection/service-builder/factories'),
            parent: require('-/danf/lib/common/dependency-injection/service-builder/parent'),
            properties: require('-/danf/lib/common/dependency-injection/service-builder/properties'),
            tags: require('-/danf/lib/common/dependency-injection/service-builder/tags')
        },
        configurationSection: {
            services: require('-/danf/lib/common/dependency-injection/configuration-section/services')
        }
    };
});