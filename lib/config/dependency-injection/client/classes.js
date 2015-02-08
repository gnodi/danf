'use strict';

define(function(require) {
    return {
        servicesContainer: require('danf/dependency-injection/services-container'),
        contextProvider: require('danf/dependency-injection/context-provider'),
        objectProvider: require('danf/dependency-injection/object-provider'),
        serviceBuilder: {
            abstractServiceBuilder: require('danf/dependency-injection/service-builder/abstract-service-builder'),
            abstract: require('danf/dependency-injection/service-builder/abstract'),
            alias: require('danf/dependency-injection/service-builder/alias'),
            children: require('danf/dependency-injection/service-builder/children'),
            class: require('danf/dependency-injection/service-builder/class'),
            declinations: require('danf/dependency-injection/service-builder/declinations'),
            factories: require('danf/dependency-injection/service-builder/factories'),
            parent: require('danf/dependency-injection/service-builder/parent'),
            properties: require('danf/dependency-injection/service-builder/properties'),
            tags: require('danf/dependency-injection/service-builder/tags')
        },
        configurationSection: {
            services: require('danf/dependency-injection/configuration-section/services')
        }
    };
});