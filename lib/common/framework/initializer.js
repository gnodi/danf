'use strict';

/**
 * Expose `Initializer`.
 */
module.exports = Initializer;

/**
 * Module dependencies.
 */
var utils = require('../utils'),
    ClassesContainer = require('../object/classes-container'),
    InterfacesContainer = require('../object/interfaces-container'),
    Interfacer = require('../object/interfacer'),
    ExtenderClassProcessor = require('../object/class-processor/extender'),
    InterfacerClassProcessor = require('../object/class-processor/interfacer'),
    ServicesContainer = require('../dependency-injection/services-container'),
    AbstractServiceBuilder = require('../dependency-injection/service-builder/abstract'),
    AliasServiceBuilder = require('../dependency-injection/service-builder/alias'),
    ChildrenServiceBuilder = require('../dependency-injection/service-builder/children'),
    ClassServiceBuilder =  require('../dependency-injection/service-builder/class'),
    DeclinationsServiceBuilder = require('../dependency-injection/service-builder/declinations'),
    FactoriesServiceBuilder = require('../dependency-injection/service-builder/factories'),
    ParentServiceBuilder = require('../dependency-injection/service-builder/parent'),
    PropertiesServiceBuilder = require('../dependency-injection/service-builder/properties'),
    CollectionsServiceBuilder = require('../dependency-injection/service-builder/collections'),
    RegistryServiceBuilder = require('../dependency-injection/service-builder/registry'),
    ParametersConfigurationSectionProcessor = require('../configuration/section-processor/parameters'),
    ServicesConfigurationSectionProcessor = require('../dependency-injection/configuration/section-processor/services'),
    NotifierRegistry = require('../manipulation/notifier-registry'),
    DataResolver = require('../manipulation/data-resolver'),
    DefaultDataInterpreter = require('../manipulation/data-interpreter/default'),
    RequiredDataInterpreter = require('../manipulation/data-interpreter/required'),
    ReferencesDataInterpreter = require('../configuration/manipulation/data-interpreter/references'),
    NamespaceDataInterpreter = require('../configuration/manipulation/data-interpreter/namespace'),
    ModulesTree = require('../configuration/modules-tree'),
    Namespacer = require('../configuration/namespacer'),
    TypeDataInterpreter = require('../manipulation/data-interpreter/type'),
    ReferenceResolver = require('../manipulation/reference-resolver'),
    ReferenceType = require('../manipulation/reference-type')
;

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

    framework.set('danf:configuration.modulesTree', new ModulesTree());
    framework.set('danf:configuration.namespacer', new Namespacer());
    framework.set('danf:configuration.configurationResolver', new DataResolver());
    framework.set('danf:configuration.configurationInterpreter.default', new DefaultDataInterpreter());
    framework.set('danf:configuration.configurationInterpreter.required', new RequiredDataInterpreter());
    framework.set('danf:configuration.configurationInterpreter.type', new TypeDataInterpreter());
    framework.set('danf:configuration.configurationInterpreter.references', new ReferencesDataInterpreter());
    framework.set('danf:configuration.configurationInterpreter.namespace', new NamespaceDataInterpreter());
    var parametersConfigurationSection = new ParametersConfigurationSectionProcessor();
    parametersConfigurationSection.name = 'parameters';
    framework.set('danf:configuration.sectionProcessor.parameters', parametersConfigurationSection);
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

    framework.set('danf:object.classesContainer', new ClassesContainer());
    framework.set('danf:object.interfacer', new Interfacer());
    framework.set('danf:object.interfacesContainer', new InterfacesContainer());
    framework.set('danf:object.classProcessor.interfacer', new InterfacerClassProcessor());
    framework.set('danf:object.classProcessor.extender', new ExtenderClassProcessor());

    framework.set('danf:dependencyInjection.servicesContainer', new ServicesContainer());
    var servicesConfigurationSection = new ServicesConfigurationSectionProcessor();
    servicesConfigurationSection.name = 'services';
    framework.set('danf:dependencyInjection.configuration.sectionProcessor.services', servicesConfigurationSection);
    framework.set('danf:dependencyInjection.serviceBuilder.abstract', new AbstractServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.alias', new AliasServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.children', new ChildrenServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.class', new ClassServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.declination', new DeclinationsServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.factories', new FactoriesServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.parent', new ParentServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.properties', new PropertiesServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.collections', new CollectionsServiceBuilder());
    framework.set('danf:dependencyInjection.serviceBuilder.registry', new RegistryServiceBuilder());
    var serviceType = new ReferenceType();
    serviceType.name = '#';
    serviceType.delimiter = '#';
    serviceType.allowsConcatenation = false;
    framework.set('danf:dependencyInjection.referenceType.service', serviceType);
    var serviceCollectionType = new ReferenceType();
    serviceCollectionType.name = '&';
    serviceCollectionType.delimiter = '&';
    serviceCollectionType.allowsConcatenation = false;
    framework.set('danf:dependencyInjection.referenceType.serviceCollection', serviceCollectionType);
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
 * @param {object} parameters The application parameters.
 * @api public
 */
Initializer.prototype.inject = function(framework, parameters) {
    var classesContainer = framework.get('danf:object.classesContainer'),
        interfacer = framework.get('danf:object.interfacer'),
        interfacesContainer = framework.get('danf:object.interfacesContainer'),
        interfacerClassProcessor = framework.get('danf:object.classProcessor.interfacer'),
        extenderClassProcessor = framework.get('danf:object.classProcessor.extender')
    ;
    interfacer.interfacesContainer = interfacesContainer;
    interfacer.debug = parameters.context.debug;
    interfacerClassProcessor.interfacesContainer = interfacesContainer;
    extenderClassProcessor.classesContainer = classesContainer;
    extenderClassProcessor.baseClassName = 'danf:object.class';
    classesContainer.addClassProcessor(extenderClassProcessor);
    classesContainer.addClassProcessor(interfacerClassProcessor);

    var referenceResolver = framework.get('danf:manipulation.referenceResolver'),
        parameterType = framework.get('danf:manipulation.referenceType.parameter'),
        contextType = framework.get('danf:manipulation.referenceType.context'),
        configType = framework.get('danf:configuration.referenceType.config'),
        serviceType = framework.get('danf:dependencyInjection.referenceType.service'),
        serviceCollectionType = framework.get('danf:dependencyInjection.referenceType.serviceCollection'),
        serviceFactoryType = framework.get('danf:dependencyInjection.referenceType.serviceFactory')
    ;
    referenceResolver.addReferenceType(parameterType);
    referenceResolver.addReferenceType(contextType);
    referenceResolver.addReferenceType(configType);
    referenceResolver.addReferenceType(serviceType);
    referenceResolver.addReferenceType(serviceCollectionType);
    referenceResolver.addReferenceType(serviceFactoryType);

    var modulesTree = framework.get('danf:configuration.modulesTree'),
        namespacer = framework.get('danf:configuration.namespacer'),
        configurationResolver = framework.get('danf:configuration.configurationResolver'),
        defaultConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.default'),
        requiredConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.required'),
        typeConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.type'),
        referencesConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.references'),
        namespaceConfigurationInterpreter = framework.get('danf:configuration.configurationInterpreter.namespace'),
        parametersProcessor = framework.get('danf:configuration.sectionProcessor.parameters')
    ;
    namespacer.addReferenceType(parameterType);
    namespacer.addReferenceType(contextType);
    namespacer.addReferenceType(configType);
    namespacer.addReferenceType(serviceType);
    namespacer.addReferenceType(serviceCollectionType);
    namespacer.addReferenceType(serviceFactoryType);
    referencesConfigurationInterpreter.namespacer = namespacer;
    namespaceConfigurationInterpreter.namespacer = namespacer;
    configurationResolver.addDataInterpreter(defaultConfigurationInterpreter);
    configurationResolver.addDataInterpreter(requiredConfigurationInterpreter);
    configurationResolver.addDataInterpreter(typeConfigurationInterpreter);
    configurationResolver.addDataInterpreter(referencesConfigurationInterpreter);
    configurationResolver.addDataInterpreter(namespaceConfigurationInterpreter);
    parametersProcessor.configurationResolver = configurationResolver;
    parametersProcessor.referenceResolver = referenceResolver;
    parametersProcessor.namespacer = namespacer;

    var servicesContainer = framework.get('danf:dependencyInjection.servicesContainer'),
        servicesProcessor = framework.get('danf:dependencyInjection.configuration.sectionProcessor.services'),
        abstractServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.abstract'),
        aliasServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.alias'),
        childrenServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.children'),
        classServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.class'),
        declinationServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.declination'),
        factoriesServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.factories'),
        parentServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.parent'),
        propertiesServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.properties'),
        collectionsServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.collections'),
        registryServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.registry')
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
    classServiceBuilder.classesContainer = classesContainer;
    declinationServiceBuilder.servicesContainer = servicesContainer;
    declinationServiceBuilder.referenceResolver = referenceResolver;
    factoriesServiceBuilder.servicesContainer = servicesContainer;
    factoriesServiceBuilder.referenceResolver = referenceResolver;
    parentServiceBuilder.servicesContainer = servicesContainer;
    parentServiceBuilder.referenceResolver = referenceResolver;
    propertiesServiceBuilder.servicesContainer = servicesContainer;
    propertiesServiceBuilder.referenceResolver = referenceResolver;
    propertiesServiceBuilder.interfacer = interfacer;
    propertiesServiceBuilder.modulesTree = modulesTree;
    propertiesServiceBuilder.namespacer = namespacer;
    collectionsServiceBuilder.servicesContainer = servicesContainer;
    collectionsServiceBuilder.referenceResolver = referenceResolver;
    collectionsServiceBuilder.interfacer = interfacer;
    registryServiceBuilder.servicesContainer = servicesContainer;
    registryServiceBuilder.referenceResolver = referenceResolver;
    servicesContainer.addServiceBuilder(abstractServiceBuilder);
    servicesContainer.addServiceBuilder(aliasServiceBuilder);
    servicesContainer.addServiceBuilder(childrenServiceBuilder);
    servicesContainer.addServiceBuilder(classServiceBuilder);
    servicesContainer.addServiceBuilder(declinationServiceBuilder);
    servicesContainer.addServiceBuilder(factoriesServiceBuilder);
    servicesContainer.addServiceBuilder(parentServiceBuilder);
    servicesContainer.addServiceBuilder(propertiesServiceBuilder);
    servicesContainer.addServiceBuilder(collectionsServiceBuilder);
    servicesContainer.addServiceBuilder(registryServiceBuilder);

    var classesConfigRegistry = framework.get('danf:configuration.registry.classes'),
        interfacesConfigRegistry = framework.get('danf:configuration.registry.interfaces'),
        servicesConfigRegistry = framework.get('danf:configuration.registry.services')
    ;
    classesConfigRegistry.addObserver(classesContainer);
    interfacesConfigRegistry.addObserver(interfacesContainer);
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
        classesContainer = framework.get('danf:object.classesContainer'),
        interfacesContainer = framework.get('danf:object.interfacesContainer'),
        interfacerClassProcessor = framework.get('danf:object.classProcessor.interfacer'),
        classesConfigRegistry = framework.get('danf:configuration.registry.classes'),
        interfacesConfigRegistry = framework.get('danf:configuration.registry.interfaces'),
        servicesConfigRegistry = framework.get('danf:configuration.registry.services')
    ;

    interfacesConfigRegistry.registerSet(danf.interfaces);
    interfacesConfigRegistry.removeObserver(interfacesContainer);
    classesConfigRegistry.registerSet(danf.classes);
    classesConfigRegistry.removeObserver(classesContainer);

    interfacerClassProcessor.process(ServicesContainer);
    interfacerClassProcessor.process(AbstractServiceBuilder);
    interfacerClassProcessor.process(AliasServiceBuilder);
    interfacerClassProcessor.process(ChildrenServiceBuilder);
    interfacerClassProcessor.process(ClassServiceBuilder);
    interfacerClassProcessor.process(DeclinationsServiceBuilder);
    interfacerClassProcessor.process(FactoriesServiceBuilder);
    interfacerClassProcessor.process(ParentServiceBuilder);
    interfacerClassProcessor.process(PropertiesServiceBuilder);
    interfacerClassProcessor.process(CollectionsServiceBuilder);

    servicesContainer.config = danf.config;
    servicesConfigRegistry.registerSet(danf.services);

    // Process configuration for new instantiated services.
    var classesContainer = framework.get('danf:object.classesContainer'),
        interfacesContainer = framework.get('danf:object.interfacesContainer'),
        classServiceBuilder = framework.get('danf:dependencyInjection.serviceBuilder.class')
    ;

    classServiceBuilder.classesContainer = classesContainer;
    classesConfigRegistry.addObserver(classesContainer);
    interfacesConfigRegistry.addObserver(interfacesContainer);
    interfacesConfigRegistry.registerSet(danf.interfaces);
    classesConfigRegistry.registerSet(danf.classes);

    // Process the configuration.
    var modulesTree = framework.get('danf:configuration.modulesTree'),
        configurationProcessor = framework.get('danf:configuration.processor')
    ;
    modulesTree.build(configuration, danf);

    var config = configurationProcessor.process(modulesTree);
    parameters['config'] = config;
    parameters['flattenConfig'] = utils.flatten(config, 1, ':');

    // Process classes config.
    interfacesConfigRegistry.registerSet(config.interfaces || {});
    classesConfigRegistry.registerSet(config.classes || {});

    // Process services config.
    servicesContainer.config = parameters['flattenConfig'];
    servicesConfigRegistry.registerSet(config.services || {});

    // Process sequencing.
    var sequencesContainer = framework.get('danf:sequencing.sequencesContainer'),
        sequencesConfigRegistry = framework.get('danf:configuration.registry.sequences'),
        referencesResolver = framework.get('danf:sequencing.referencesResolver')
    ;
    referencesResolver.config = parameters['flattenConfig'];
    sequencesConfigRegistry.addObserver(sequencesContainer);
    sequencesConfigRegistry.registerSet(danf.sequences || {});
    sequencesConfigRegistry.registerSet(config.sequences || {});

    // Process events.
    var eventsContainer = framework.get('danf:event.eventsContainer'),
        eventsConfigRegistry = framework.get('danf:configuration.registry.events'),
        router = framework.get('danf:http.router')
    ;
    eventsConfigRegistry.addObserver(eventsContainer);
    eventsConfigRegistry.addObserver(router);
    eventsConfigRegistry.registerSet(danf.events || {});
    eventsConfigRegistry.registerSet(config.events || {});

    // Finalize services building.
    servicesContainer.finalize();
}