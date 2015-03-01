'use strict';

var define = define ? define : require('amdefine')(module);

var utils,
    ClassesHandler,
    ClassesRegistry,
    InterfacesRegistry,
    Interfacer,
    ExtenderClassProcessor,
    InterfacerClassProcessor,
    ServicesContainer,
    AbstractServiceBuilder,
    AliasServiceBuilder,
    ChildrenServiceBuilder,
    ClassServiceBuilder,
    DeclinationsServiceBuilder,
    FactoriesServiceBuilder,
    ParentServiceBuilder,
    PropertiesServiceBuilder,
    TagsServiceBuilder,
    ParametersConfigurationSectionProcessor,
    ServicesConfigurationSectionProcessor,
    NotifierRegistry,
    DataResolver,
    DefaultDataInterpreter,
    RequiredDataInterpreter,
    ReferencesDataInterpreter,
    NamespacesDataInterpreter,
    Namespacer,
    TypeDataInterpreter,
    ReferenceResolver,
    ReferenceType
;

if (!module.isClient) {
    utils = require('./utils');
    ClassesHandler = require('./common/object/classes-handler');
    ClassesRegistry = require('./common/object/classes-registry');
    InterfacesRegistry = require('./common/object/interfaces-registry');
    Interfacer = require('./common/object/interfacer');
    ExtenderClassProcessor = require('./common/object/class-processor/extender');
    InterfacerClassProcessor = require('./common/object/class-processor/interfacer');
    ServicesContainer = require('./common/dependency-injection/services-container');
    AbstractServiceBuilder = require('./common/dependency-injection/service-builder/abstract');
    AliasServiceBuilder = require('./common/dependency-injection/service-builder/alias');
    ChildrenServiceBuilder = require('./common/dependency-injection/service-builder/children');
    ClassServiceBuilder =  require('./common/dependency-injection/service-builder/class');
    DeclinationsServiceBuilder = require('./common/dependency-injection/service-builder/declinations');
    FactoriesServiceBuilder = require('./common/dependency-injection/service-builder/factories');
    ParentServiceBuilder = require('./common/dependency-injection/service-builder/parent');
    PropertiesServiceBuilder = require('./common/dependency-injection/service-builder/properties');
    TagsServiceBuilder = require('./common/dependency-injection/service-builder/tags');
    ParametersConfigurationSectionProcessor = require('./common/configuration/configuration-section/parameters');
    ServicesConfigurationSectionProcessor = require('./common/dependency-injection/configuration-section/services');
    NotifierRegistry = require('./common/manipulation/notifier-registry');
    DataResolver = require('./common/manipulation/data-resolver');
    DefaultDataInterpreter = require('./common/manipulation/data-interpreter/default');
    RequiredDataInterpreter = require('./common/manipulation/data-interpreter/required');
    ReferencesDataInterpreter = require('./common/configuration/data-interpreter/references');
    NamespacesDataInterpreter = require('./common/configuration/data-interpreter/namespaces');
    Namespacer = require('./common/configuration/namespacer');
    TypeDataInterpreter = require('./common/manipulation/data-interpreter/type');
    ReferenceResolver = require('./common/manipulation/reference-resolver');
    ReferenceType = require('./common/manipulation/reference-type');
}

define(function(require) {
    /**
     * Module dependencies.
     */
     if (module.isClient) {
        utils = require('danf/utils');
        ClassesHandler = require('danf/lib/common/object/classes-handler');
        ClassesRegistry = require('danf/lib/common/object/classes-registry');
        InterfacesRegistry = require('danf/lib/common/object/interfaces-registry');
        Interfacer = require('danf/lib/common/object/interfacer');
        ExtenderClassProcessor = require('danf/lib/common/object/class-processor/extender');
        InterfacerClassProcessor = require('danf/lib/common/object/class-processor/interfacer');
        ServicesContainer = require('danf/lib/common/dependency-injection/services-container');
        AbstractServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/abstract');
        AliasServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/alias');
        ChildrenServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/children');
        ClassServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/class');
        DeclinationsServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/declinations');
        FactoriesServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/factories');
        ParentServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/parent');
        PropertiesServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/properties');
        TagsServiceBuilder = require('danf/lib/common/dependency-injection/service-builder/tags');
        ParametersConfigurationSectionProcessor = require('danf/lib/common/configuration/configuration-section/parameters');
        ServicesConfigurationSectionProcessor = require('danf/lib/common/dependency-injection/configuration-section/services');
        NotifierRegistry = require('danf/lib/common/manipulation/notifier-registry');
        DataResolver = require('danf/lib/common/manipulation/data-resolver');
        DefaultDataInterpreter = require('danf/lib/common/manipulation/data-interpreter/default');
        RequiredDataInterpreter = require('danf/lib/common/manipulation/data-interpreter/required');
        ReferencesDataInterpreter = require('danf/lib/common/configuration/data-interpreter/references');
        NamespacesDataInterpreter = require('danf/lib/common/configuration/data-interpreter/namespaces');
        Namespacer = require('danf/lib/common/configuration/namespacer');
        TypeDataInterpreter = require('danf/lib/common/manipulation/data-interpreter/type');
        ReferenceResolver = require('danf/lib/common/manipulation/reference-resolver');
        ReferenceType = require('danf/lib/common/manipulation/reference-type');
    }

    /**
     * Initialize a new framework.
     */
    function Initializer() {
    }

    /**
     * Instantiate objects.
     *
     * @param {object} framework The framework.
     * @api public
     */
    Initializer.prototype.instantiate = function(framework) {
        framework.set('danf:manipulation.referenceResolver', new ReferenceResolver());
        var parameterType = new ReferenceType();
        parameterType.name = '%';
        parameterType.delimiter = '%';
        framework.set('danf:manipulation.referenceType.parameter', parameterType);
        var contextType = new ReferenceType();
        contextType.name = '@';
        contextType.delimiter = '@';
        framework.set('danf:manipulation.referenceType.context', contextType);

        framework.set('danf:configuration.namespacer', new Namespacer());
        framework.set('danf:configuration.configurationResolver', new DataResolver());
        framework.set('danf:configuration.configurationInterpreter.default', new DefaultDataInterpreter());
        framework.set('danf:configuration.configurationInterpreter.required', new RequiredDataInterpreter());
        framework.set('danf:configuration.configurationInterpreter.type', new TypeDataInterpreter());
        framework.set('danf:configuration.configurationInterpreter.references', new ReferencesDataInterpreter());
        framework.set('danf:configuration.configurationInterpreter.namespaces', new NamespacesDataInterpreter());
        framework.set('danf:configuration.configurationSection.parameters', new ParametersConfigurationSectionProcessor('parameters'));
        var configType = new ReferenceType();
        configType.name = '$';
        configType.delimiter = '$';
        framework.set('danf:configuration.referenceType.config', configType);
        var classesConfigRegistry = new NotifierRegistry();
        classesConfigRegistry.name = 'classes';
        framework.set('danf:configuration.registry.classes', classesConfigRegistry);
        var interfacesConfigRegistry = new NotifierRegistry();
        interfacesConfigRegistry.name = 'interfaces';
        framework.set('danf:configuration.registry.interfaces', interfacesConfigRegistry);
        var servicesConfigRegistry = new NotifierRegistry();
        servicesConfigRegistry.name = 'services';
        framework.set('danf:configuration.registry.services', servicesConfigRegistry);
        var eventsConfigRegistry = new NotifierRegistry();
        eventsConfigRegistry.name = 'events';
        framework.set('danf:configuration.registry.events', eventsConfigRegistry);
        var sequencesConfigRegistry = new NotifierRegistry();
        sequencesConfigRegistry.name = 'sequences';
        framework.set('danf:configuration.registry.sequences', sequencesConfigRegistry);

        framework.set('danf:object.classesHandler', new ClassesHandler());
        framework.set('danf:object.interfacer', new Interfacer());
        framework.set('danf:object.classesRegistry', new ClassesRegistry());
        framework.set('danf:object.interfacesRegistry', new InterfacesRegistry());
        framework.set('danf:object.classProcessor.interfacer', new InterfacerClassProcessor());
        framework.set('danf:object.classProcessor.extender', new ExtenderClassProcessor());

        framework.set('danf:dependencyInjection.servicesContainer', new ServicesContainer());
        framework.set('danf:dependencyInjection.configurationSection.services', new ServicesConfigurationSectionProcessor('services'));
        framework.set('danf:dependencyInjection.serviceBuilder.abstract', new AbstractServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.alias', new AliasServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.children', new ChildrenServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.class', new ClassServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.declination', new DeclinationsServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.factories', new FactoriesServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.parent', new ParentServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.properties', new PropertiesServiceBuilder());
        framework.set('danf:dependencyInjection.serviceBuilder.tags', new TagsServiceBuilder());
        var serviceType = new ReferenceType();
        serviceType.name = '#';
        serviceType.delimiter = '#';
        serviceType.allowsConcatenation = false;
        framework.set('danf:dependencyInjection.referenceType.service', serviceType);
        var serviceTagType = new ReferenceType();
        serviceTagType.name = '&';
        serviceTagType.delimiter = '&';
        serviceTagType.allowsConcatenation = false;
        framework.set('danf:dependencyInjection.referenceType.serviceTag', serviceTagType);
        var serviceFactoryType = new ReferenceType();
        serviceFactoryType.name = '>';
        serviceFactoryType.delimiter = '>';
        serviceFactoryType.size = 3;
        serviceFactoryType.allowsConcatenation = false;
        framework.set('danf:dependencyInjection.referenceType.serviceFactory', serviceFactoryType);
    }

    /**
     * Inject dependencies between objects.
     *
     * @param {object} framework The framework.
     * @api public
     */
    Initializer.prototype.inject = function(framework) {
        var classesHandler = framework.get('danf:object.classesHandler'),
            interfacer = framework.get('danf:object.interfacer'),
            classesRegistry = framework.get('danf:object.classesRegistry'),
            interfacesRegistry = framework.get('danf:object.interfacesRegistry'),
            interfacerClassProcessor = framework.get('danf:object.classProcessor.interfacer'),
            extenderClassProcessor = framework.get('danf:object.classProcessor.extender')
        ;
        classesHandler.classesRegistry = classesRegistry;
        interfacer.interfacesRegistry = interfacesRegistry;
        interfacerClassProcessor.interfacesRegistry = interfacesRegistry;
        extenderClassProcessor.classesRegistry = classesRegistry;
        classesHandler.addClassProcessor(extenderClassProcessor);
        classesHandler.addClassProcessor(interfacerClassProcessor);

        var referenceResolver = framework.get('danf:manipulation.referenceResolver'),
            parameterType = framework.get('danf:manipulation.referenceType.parameter'),
            contextType = framework.get('danf:manipulation.referenceType.context'),
            configType = framework.get('danf:configuration.referenceType.config'),
            serviceType = framework.get('danf:dependencyInjection.referenceType.service'),
            serviceTagType = framework.get('danf:dependencyInjection.referenceType.serviceTag'),
            serviceFactoryType = framework.get('danf:dependencyInjection.referenceType.serviceFactory')
        ;
        referenceResolver.addReferenceType(parameterType);
        referenceResolver.addReferenceType(contextType);
        referenceResolver.addReferenceType(configType);
        referenceResolver.addReferenceType(serviceType);
        referenceResolver.addReferenceType(serviceTagType);
        referenceResolver.addReferenceType(serviceFactoryType);

        var namespacer = framework.get('danf:configuration.namespacer'),
            configurationResolver = framework.get('danf:configuration.configurationResolver'),
            defaultConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.default'),
            requiredConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.required'),
            typeConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.type'),
            referencesConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.references'),
            namespacesConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.namespaces'),
            parametersProcessor = framework.get('danf:configuration.configurationSection.parameters')
        ;
        namespacer.addReferenceType(parameterType);
        namespacer.addReferenceType(contextType);
        namespacer.addReferenceType(configType);
        namespacer.addReferenceType(serviceType);
        namespacer.addReferenceType(serviceTagType);
        namespacer.addReferenceType(serviceFactoryType);
        referencesConfigurationInterpreter.namespacer = namespacer;
        namespacesConfigurationInterpreter.namespacer = namespacer;
        configurationResolver.addDataInterpreter(defaultConfigurationInterpreter);
        configurationResolver.addDataInterpreter(requiredConfigurationInterpreter);
        configurationResolver.addDataInterpreter(typeConfigurationInterpreter);
        configurationResolver.addDataInterpreter(referencesConfigurationInterpreter);
        configurationResolver.addDataInterpreter(namespacesConfigurationInterpreter);
        parametersProcessor.configurationResolver = configurationResolver;
        parametersProcessor.referenceResolver = referenceResolver;
        parametersProcessor.namespacer = namespacer;

        var servicesContainer = framework.get('danf:dependencyInjection.servicesContainer'),
            servicesProcessor = framework.get('danf:dependencyInjection.configurationSection.services'),
            abstractServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.abstract'),
            aliasServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.alias'),
            childrenServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.children'),
            classServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.class'),
            declinationServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.declination'),
            factoriesServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.factories'),
            parentServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.parent'),
            propertiesServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.properties'),
            tagsServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.tags')
        ;
        servicesContainer.referenceResolver = referenceResolver;
        servicesContainer.interfacer = interfacer;
        servicesProcessor.configurationResolver = configurationResolver;
        servicesProcessor.referenceResolver = referenceResolver;
        servicesProcessor.namespacer = namespacer;
        servicesProcessor.servicesContainer = servicesContainer;
        abstractServiceBuilder.servicesContainer = servicesContainer;
        abstractServiceBuilder.referenceResolver = referenceResolver;
        aliasServiceBuilder.servicesContainer = servicesContainer;
        aliasServiceBuilder.referenceResolver = referenceResolver;
        childrenServiceBuilder.servicesContainer = servicesContainer;
        childrenServiceBuilder.referenceResolver = referenceResolver;
        classServiceBuilder.servicesContainer = servicesContainer;
        classServiceBuilder.referenceResolver = referenceResolver;
        classServiceBuilder.classesRegistry = classesRegistry;
        declinationServiceBuilder.servicesContainer = servicesContainer;
        declinationServiceBuilder.referenceResolver = referenceResolver;
        factoriesServiceBuilder.servicesContainer = servicesContainer;
        factoriesServiceBuilder.referenceResolver = referenceResolver;
        parentServiceBuilder.servicesContainer = servicesContainer;
        parentServiceBuilder.referenceResolver = referenceResolver;
        propertiesServiceBuilder.servicesContainer = servicesContainer;
        propertiesServiceBuilder.referenceResolver = referenceResolver;
        propertiesServiceBuilder.interfacer = interfacer;
        tagsServiceBuilder.servicesContainer = servicesContainer;
        tagsServiceBuilder.referenceResolver = referenceResolver;
        tagsServiceBuilder.interfacer = interfacer;
        servicesContainer.addServiceBuilder(abstractServiceBuilder);
        servicesContainer.addServiceBuilder(aliasServiceBuilder);
        servicesContainer.addServiceBuilder(childrenServiceBuilder);
        servicesContainer.addServiceBuilder(classServiceBuilder);
        servicesContainer.addServiceBuilder(declinationServiceBuilder);
        servicesContainer.addServiceBuilder(factoriesServiceBuilder);
        servicesContainer.addServiceBuilder(parentServiceBuilder);
        servicesContainer.addServiceBuilder(propertiesServiceBuilder);
        servicesContainer.addServiceBuilder(tagsServiceBuilder);

        var classesConfigRegistry = framework.get('danf:configuration.registry.classes'),
            interfacesConfigRegistry = framework.get('danf:configuration.registry.interfaces'),
            servicesConfigRegistry = framework.get('danf:configuration.registry.services')
        ;
        classesConfigRegistry.addObserver(classesRegistry);
        interfacesConfigRegistry.addObserver(interfacesRegistry);
        servicesConfigRegistry.addObserver(servicesContainer);

        // Replace framework objects container.
        for (var id in framework.objectsContainer.objects) {
            servicesContainer.set(id, framework.objectsContainer.objects[id]);
        }
        framework.objectsContainer = servicesContainer;
    }

    /**
     * Process.
     *
     * @param {object} framework The framework.
     * @param {object} parameters The application parameters.
     * @param {object} danf The danf config.
     * @param {object} configuration The application danf configuration.
     * @api public
     */
    Initializer.prototype.process = function(framework, parameters, danf, configuration) {
        var app = framework.get('danf:app');

        // Process danf module.
        var servicesContainer = framework.get('danf:dependencyInjection.servicesContainer'),
            classesHandler = framework.get('danf:object.classesHandler'),
            classesRegistry = framework.get('danf:object.classesRegistry'),
            interfacesRegistry = framework.get('danf:object.interfacesRegistry'),
            interfacerClassProcessor = framework.get('danf:object.classProcessor.interfacer'),
            classesConfigRegistry = framework.get('danf:configuration.registry.classes'),
            interfacesConfigRegistry = framework.get('danf:configuration.registry.interfaces'),
            servicesConfigRegistry = framework.get('danf:configuration.registry.services')
        ;

        classesConfigRegistry.registerSet(danf.classes);
        interfacesConfigRegistry.registerSet(danf.interfaces);
        classesConfigRegistry.removeObserver(classesRegistry);
        interfacesConfigRegistry.removeObserver(interfacesRegistry);

        interfacerClassProcessor.process(ServicesContainer);
        interfacerClassProcessor.process(AbstractServiceBuilder);
        interfacerClassProcessor.process(AliasServiceBuilder);
        interfacerClassProcessor.process(ChildrenServiceBuilder);
        interfacerClassProcessor.process(ClassServiceBuilder);
        interfacerClassProcessor.process(DeclinationsServiceBuilder);
        interfacerClassProcessor.process(FactoriesServiceBuilder);
        interfacerClassProcessor.process(ParentServiceBuilder);
        interfacerClassProcessor.process(PropertiesServiceBuilder);
        interfacerClassProcessor.process(TagsServiceBuilder);

        classesHandler.process();
        servicesContainer.config = danf.config;
        servicesConfigRegistry.registerSet(danf.services);

        // Process configuration for new instantiated services.
        var classesRegistry = servicesContainer.get('danf:object.classesRegistry'),
            interfacesRegistry = servicesContainer.get('danf:object.interfacesRegistry'),
            classServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.class')
        ;
        classServiceBuilder.classesRegistry = classesRegistry;
        classesConfigRegistry.addObserver(classesRegistry);
        interfacesConfigRegistry.addObserver(interfacesRegistry);
        classesConfigRegistry.registerSet(danf.classes);
        interfacesConfigRegistry.registerSet(danf.interfaces);
        classesHandler = servicesContainer.get('danf:object.classesHandler');
        classesHandler.process();

        // Process the configuration.
        var modulesTree = framework.get('danf:configuration.modulesTree'),
            configurationProcessor = framework.get('danf:configuration.processor')
        ;
        modulesTree.build(configuration, danf);

        var config = configurationProcessor.process(modulesTree);
        parameters['config'] = config;
        parameters['flattenConfig'] = utils.flatten(config, 1, ':');

        // Process classes config.
        classesConfigRegistry.registerSet(config.classes || {});
        interfacesConfigRegistry.registerSet(config.interfaces || {});
        classesHandler.process();

        // Process services config.
        servicesContainer.config = parameters['flattenConfig'];
        servicesConfigRegistry.registerSet(config.services || {});

        // Process events.
        var sequenceBuilder = framework.get('danf:event.sequenceBuilder'),
            eventsHandler = framework.get('danf:event.eventsHandler'),
            sequencesConfigRegistry = framework.get('danf:configuration.registry.sequences'),
            eventsConfigRegistry = framework.get('danf:configuration.registry.events')
        ;
        sequenceBuilder.config = parameters['flattenConfig'];
        sequencesConfigRegistry.addObserver(sequenceBuilder);
        eventsConfigRegistry.addObserver(eventsHandler);
        sequencesConfigRegistry.registerSet(config.sequences || {});
        eventsConfigRegistry.registerSet(config.events || {});
    }

    /**
     * Expose `Initializer`.
     */
    return Initializer;
});