'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ServicesContainer = require('../../../lib/common/dependency-injection/services-container'),
    AbstractServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/abstract'),
    AliasServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/alias'),
    ChildrenServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/children'),
    ClassServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/class'),
    DeclinationsServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/declinations'),
    FactoriesServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/factories'),
    ParentServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/parent'),
    PropertiesServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/properties'),
    CollectionsServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/collections'),
    RegistryServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/registry'),
    InducedServiceBuilder = require('../../../lib/common/dependency-injection/service-builder/induced'),
    AbstractBuilder = require('../../../lib/common/dependency-injection/service-builder/abstract-service-builder'),
    ReferenceResolver = require('../../../lib/common/manipulation/reference-resolver'),
    ReferenceType = require('../../../lib/common/manipulation/reference-type'),
    InterfacesContainer = require('../../../lib/common/object/interfaces-container'),
    Interfacer = require('../../../lib/common/object/interfacer'),
    Namespacer = require('../../../lib/common/configuration/namespacer'),
    utils = require('../../../lib/common/utils')
;

var referenceResolver = new ReferenceResolver(),
    interfacesContainer = new InterfacesContainer(),
    interfacer = new Interfacer(),
    modulesTree = require('../../fixture/configuration/modules-tree'),
    namespacer = new Namespacer(),
    servicesContainer = new ServicesContainer()
;

interfacer.interfacesContainer = interfacesContainer;

var parameterType = new ReferenceType();
parameterType.name = '%';
parameterType.delimiter = '%';

var contextType = new ReferenceType();
contextType.name = '@';
contextType.delimiter = '@';

var factoryContextType = new ReferenceType();
factoryContextType.name = '!';
factoryContextType.delimiter = '!';

var configType = new ReferenceType();
configType.name = '$';
configType.delimiter = '$';

var serviceType = new ReferenceType();
serviceType.name = '#';
serviceType.delimiter = '#';
serviceType.allowsConcatenation = false;

var serviceCollectionType = new ReferenceType();
serviceCollectionType.name = '&';
serviceCollectionType.delimiter = '&';
serviceCollectionType.allowsConcatenation = false;

var serviceFactoryType = new ReferenceType();
serviceFactoryType.name = '>';
serviceFactoryType.delimiter = '>';
serviceFactoryType.size = 3;
serviceFactoryType.allowsConcatenation = false;

referenceResolver.addReferenceType(parameterType);
referenceResolver.addReferenceType(contextType);
referenceResolver.addReferenceType(factoryContextType);
referenceResolver.addReferenceType(configType);
referenceResolver.addReferenceType(serviceType);
referenceResolver.addReferenceType(serviceCollectionType);
referenceResolver.addReferenceType(serviceFactoryType);

var abstractServiceBuilder = new AbstractServiceBuilder();
abstractServiceBuilder.servicesContainer = servicesContainer;
abstractServiceBuilder.referenceResolver = referenceResolver;

var aliasServiceBuilder = new AliasServiceBuilder();
aliasServiceBuilder.servicesContainer = servicesContainer;
aliasServiceBuilder.referenceResolver = referenceResolver;

var childrenServiceBuilder = new ChildrenServiceBuilder();
childrenServiceBuilder.servicesContainer = servicesContainer;
childrenServiceBuilder.referenceResolver = referenceResolver;

var classServiceBuilder = new ClassServiceBuilder();
classServiceBuilder.servicesContainer = servicesContainer;
classServiceBuilder.referenceResolver = referenceResolver;
classServiceBuilder.modulesTree = modulesTree;
classServiceBuilder.namespacer = namespacer;

var declinationsServiceBuilder = new DeclinationsServiceBuilder();
declinationsServiceBuilder.servicesContainer = servicesContainer;
declinationsServiceBuilder.referenceResolver = referenceResolver;

var factoriesServiceBuilder = new FactoriesServiceBuilder();
factoriesServiceBuilder.servicesContainer = servicesContainer;
factoriesServiceBuilder.referenceResolver = referenceResolver;

var parentServiceBuilder = new ParentServiceBuilder();
parentServiceBuilder.servicesContainer = servicesContainer;
parentServiceBuilder.referenceResolver = referenceResolver;

var propertiesServiceBuilder = new PropertiesServiceBuilder();
propertiesServiceBuilder.servicesContainer = servicesContainer;
propertiesServiceBuilder.referenceResolver = referenceResolver;
propertiesServiceBuilder.interfacer = interfacer;

var collectionsServiceBuilder = new CollectionsServiceBuilder();
collectionsServiceBuilder.servicesContainer = servicesContainer;
collectionsServiceBuilder.referenceResolver = referenceResolver;
collectionsServiceBuilder.interfacer = interfacer;

var registryServiceBuilder = new RegistryServiceBuilder();
registryServiceBuilder.servicesContainer = servicesContainer;
registryServiceBuilder.referenceResolver = referenceResolver;
registryServiceBuilder.interfacer = interfacer;
registryServiceBuilder.modulesTree = modulesTree;
registryServiceBuilder.namespacer = namespacer;

var inducedServiceBuilder = new InducedServiceBuilder();
inducedServiceBuilder.servicesContainer = servicesContainer;
inducedServiceBuilder.referenceResolver = referenceResolver;

servicesContainer.addServiceBuilder(abstractServiceBuilder);
servicesContainer.addServiceBuilder(aliasServiceBuilder);
servicesContainer.addServiceBuilder(childrenServiceBuilder);
servicesContainer.addServiceBuilder(classServiceBuilder);
servicesContainer.addServiceBuilder(declinationsServiceBuilder);
servicesContainer.addServiceBuilder(factoriesServiceBuilder);
servicesContainer.addServiceBuilder(parentServiceBuilder);
servicesContainer.addServiceBuilder(propertiesServiceBuilder);
servicesContainer.addServiceBuilder(collectionsServiceBuilder);
servicesContainer.addServiceBuilder(registryServiceBuilder);
servicesContainer.addServiceBuilder(inducedServiceBuilder);
servicesContainer.referenceResolver = referenceResolver;

var servicesContainerPrototype = utils.clone(servicesContainer),
    getServiceContainer = function(create) {
        var currentServicesContainer = servicesContainer;

        if (create) {
            currentServicesContainer = utils.clone(servicesContainerPrototype);
        }

        abstractServiceBuilder.servicesContainer = currentServicesContainer;
        aliasServiceBuilder.servicesContainer = currentServicesContainer;
        childrenServiceBuilder.servicesContainer = currentServicesContainer;
        classServiceBuilder.servicesContainer = currentServicesContainer;
        declinationsServiceBuilder.servicesContainer = currentServicesContainer;
        factoriesServiceBuilder.servicesContainer = currentServicesContainer;
        parentServiceBuilder.servicesContainer = currentServicesContainer;
        propertiesServiceBuilder.servicesContainer = currentServicesContainer;
        collectionsServiceBuilder.servicesContainer = currentServicesContainer;
        registryServiceBuilder.servicesContainer = currentServicesContainer;
        inducedServiceBuilder.servicesContainer = currentServicesContainer;

        return currentServicesContainer;
    }
;

var Provider = function() { this.name = 'provider'; };
Provider.prototype.provide = function() {
    return this.name;
};
Provider.prototype.reset = function() {
    this.name = '';
};
Provider.defineImplementedInterfaces(['provider']);

interfacesContainer.setDefinition(
    'provider',
    {
        methods: {
            provide: {
                arguments: []
            }
        },
        getters: {
            id: 'string'
        }
    }
);

var Manager = function() { this.name = 'manager'; };
Manager.defineDependency('providers', 'provider_object');
Object.defineProperty(Manager.prototype, 'providers', {
    get: function() {
        return this._providers;
    },
    set: function(providers) {
        this._providers = {};

        for (var i = 0; i < providers.length; i++) {
            var provider = providers[i];

            this._providers[provider.id] = provider;
        }
    }
});

var Registry = function() {
    this.items = {
        a: 1,
        b: 2,
        c: 3
    };
};
Registry.prototype.get = function(name) {
    return this.items[name];
};

var DeepRegistry = function() {
    this.items = {
        a: {
            i: 5
        },
        b: {
            i: 3,
            j: 6
        },
        c: {
            j: 7
        }
    };
};
DeepRegistry.prototype.retrieve = function(i, j) {
    return this.items[i][j];
};

var config = {
    services: {
        manager: {
            class: Manager,
            properties: {
                providers: '&provider&',
                storages: '&storage&',
                timeOut: '$timeOut$'
            }
        },
        provider: {
            class: Provider,
            declinations: '$providers$',
            properties: {
                id: '@_@',
                storages: '#storage.@storages@#',
                adapter: '#@adapter@#',
                item: '#registry[b]#',
                deepItem: '#deepRegistry[b][j]#'
            },
            collections: ['provider'],
            induced: {
                rule: {
                    service: 'rule',
                    factory: 'provider',
                    context: '@rules@',
                    property: 'rules',
                    collection: true
                }
            }
        },
        rule: {
            factories: {
                provider: {
                    parent: 'rule.@_@',
                    declinations: '!.!',
                    induced: {
                        parameter: {
                            service: 'parameter',
                            factory: 'rule',
                            context: '@parameters@',
                            property: 'parameters',
                            collection: true
                        }
                    }
                }
            },
            children: {
                minSize: {
                    class: function() { this.name = 'rule minSize'; },
                    abstract: true
                },
                maxSize: {
                    class: function() { this.name = 'rule maxSize'; },
                    abstract: true
                }
            }
        },
        adapter: {
            children: {
                image: {
                    class: function() { this.name = 'adapter image'; }
                }
            }
        },
        parameter: {
            factories: {
                rule: {
                    parent: 'parameter.@type@',
                    declinations: '!.!',
                    properties: {
                        value: '@value@'
                    }
                }
            },
            abstract: true
        },
        'parameter.size': {
            class: function() { this.name = 'parameter size'; },
            abstract: true
        },
        'parameter.unit': {
            class: function() { this.name = 'parameter unit'; },
            abstract: true
        },
        abstractStorage: {
            abstract: true,
            properties: {
                size: '2GB',
                type: 'SD'
            }
        },
        storage: {
            parent: 'abstractStorage',
            collections: ['storage'],
            properties: {
                type: 'HD'
            },
            children: {
                local: {
                    class: function() { this.name = 'local storage'; }
                },
                remote: {
                    class: function() { this.name = 'remote storage'; }
                }
            }
        },
        registry: {
            class: Registry,
            registry: {
                method: 'get'
            }
        },
        deepRegistry: {
            class: DeepRegistry,
            registry: {
                method: 'retrieve'
            }
        },
        server: {
            class: function() { this.name = 'server'; },
            properties: {
                databases: '&databases&'
            }
        },
        database: {
            class: function() { this.type = 'database'; },
            declinations: '$databases$',
            properties: {
                name: 'database @_@'
            },
            collections: ['databases'],
            induced: {
                collection: {
                    service: 'collection',
                    factory: 'database',
                    context: '@.@',
                    property: 'collections',
                    collection: true
                }
            }
        },
        collection: {
            class: function() { this.type = 'collection'; },
            factories: {
                database: {
                    declinations: '!collections!',
                    properties: {
                        name: 'collection @name@'
                    }
                }
            }
        }
    },
    providers: {
        smallImages: {
            rules: {
                maxSize: {
                    parameters: [{
                        type: 'size',
                        value: '2m'
                    }]
                }
            },
            storages: ['local'],
            adapter: 'adapter.image'
        },
        bigImages: {
            rules: {
                minSize: {
                    parameters: [
                        {
                            type: 'size',
                            value: 2
                        },
                        {
                            type: 'unit',
                            value: 'm'
                        }
                    ],
                },
                maxSize: {
                    parameters: [
                        {
                            type: 'size',
                            value: 10
                        },
                        {
                            type: 'unit',
                            value: 'm'
                        }
                    ],
                }
            },
            storages: ['local', 'remote'],
            adapter: 'adapter.image'
        }
    },
    timeOut: 2000,
    databases: {
        forums: {
            name: 'forum',
            collections: {
                forums: {
                    name: 'forum'
                },
                topics: {
                    name: 'topic'
                }
            }
        },
        users: {
            name: 'user',
            collections: {
                users: {
                    name: 'author'
                }
            }
        }
    }
};

var expectedBigImagesProvider = {
    id: 'bigImages',
    name: 'provider',
    item: 2,
    deepItem: 6,
    rules: [
        {
            name: 'rule minSize',
            parameters: [
                {name: 'parameter size', value: 2},
                {name: 'parameter unit', value: 'm'}
            ]
        },
        {
            name: 'rule maxSize',
            parameters: [
                {name: 'parameter size', value: 10},
                {name: 'parameter unit', value: 'm'}
            ]
        }
    ],
    storages: [
        {name: 'local storage', size: '2GB', type: 'HD'},
        {name: 'remote storage', size: '2GB', type: 'HD'}
    ],
    adapter: {name: 'adapter image'}
};

var expectedServer = {
    name: 'server',
    databases: [
        {
            type: 'database',
            name: 'database forums',
            collections: [
                {
                    type: 'collection',
                    name: 'collection forum'
                },
                {
                    type: 'collection',
                    name: 'collection topic'
                }
            ]
        },
        {
            type: 'database',
            name: 'database users',
            collections: [
                {
                    type: 'collection',
                    name: 'collection author'
                }
            ]
        }
    ]
};

describe('ServicesContainer', function() {
    it('method "handleRegistryChange" should set the definitions of the configured services', function() {
        servicesContainer.config = config;
        servicesContainer.handleRegistryChange(config.services);

        assert(servicesContainer.hasDefinition('manager'));
        assert(servicesContainer.hasDefinition('provider'));
        assert(servicesContainer.hasDefinition('provider.bigImages'));

        servicesContainer.finalize();
    })

    describe('method "get"', function() {
        var provider;

        it('should instanciate the definition of the services', function() {
            provider = servicesContainer.get('provider.bigImages');

            assert(provider instanceof Provider);
        })

        it('should resolve and inject the dependencies of the services', function() {
            assert.deepEqual(utils.clean(provider), expectedBigImagesProvider);
        })

        it('should resolve and inject registry dependencies of the services', function() {
            var provider = servicesContainer.get('provider.bigImages');

            assert.equal(provider.item, 2);
            assert.equal(provider.deepItem, 6);
        })

        it('should resolve the collections', function() {
            var manager = servicesContainer.get('manager');

            assert.notEqual(manager.providers.bigImages, undefined);
            assert.equal(manager.storages.length, 2);
        })

        it('should add proxies to the properties of the services', function() {
            var manager = servicesContainer.get('manager'),
                provider = manager.providers.bigImages
            ;

            assert.equal(provider.provide(), 'provider');
        })

        it('should fail to resolve a non-existent reference', function() {
            assert.throws(
                function() {
                    var badConfig = utils.clone(config),
                        servicesContainer = getServiceContainer(true)
                    ;

                    badConfig.services.provider.declinations = '$providersTypo$';
                    servicesContainer.config = badConfig;
                    servicesContainer.handleRegistryChange(badConfig.services);
                },
                /The reference "\$providersTypo\$" in source "\$providersTypo\$" declared in the definition of the service "provider" cannot be resolved./
            );
        })

        it('should resolve and inject the dependencies of the services', function() {
            var server = servicesContainer.get('server');

            assert.deepEqual(utils.clean(server), expectedServer);
        })

        it('should fail to instantiate an abstract service', function() {
            assert.throws(
                function() {
                    var servicesContainer = getServiceContainer(true);

                    servicesContainer.config = {};
                    servicesContainer.handleRegistryChange(
                        {
                            a: {
                                class: function() {},
                                abstract: true
                            }
                        }
                    );

                    servicesContainer.get('a');
                },
                /The service of id "a" is an abstract service and cannot be instantiated\./
            );
        })

        it('should fail to instantiate a service defined on an abstract class', function() {
            assert.throws(
                function() {
                    var servicesContainer = getServiceContainer(true),
                        AbstractClass = function() {}
                    ;

                    AbstractClass.defineAsAbstract();
                    AbstractClass.__metadata.id = 'A';

                    servicesContainer.config = {};
                    servicesContainer.handleRegistryChange(
                        {
                            a: {
                                class: AbstractClass
                            }
                        }
                    );

                    servicesContainer.get('a');
                },
                /The service "a" could not be instantiated because its class "A" is an abstract class\./
            );
        })

        it('should fail to instantiate a service with a circular dependency', function() {
            assert.throws(
                function() {
                    var servicesContainer = getServiceContainer(true);

                    servicesContainer.config = {};
                    servicesContainer.handleRegistryChange(
                        {
                            a: {
                                class: function() {},
                                properties: {
                                    b: '#b#'
                                }
                            },
                            b: {
                                class: function() {},
                                properties: {
                                    c: '#c#'
                                }
                            },
                            c: {
                                class: function() {},
                                properties: {
                                    a: '#a#'
                                }
                            }
                        }
                    );
                },
                /The circular dependency \["a" -> "b" -> "c" -> "a"\] prevent to build the service "a"\./
            );
        })

        it('should fail to instantiate a registry service with no retrieving implemented method', function() {
            assert.throws(
                function() {
                    var servicesContainer = getServiceContainer(true);

                    servicesContainer.config = {};
                    servicesContainer.handleRegistryChange(
                        {
                            a: {
                                class: Registry,
                                registry: {
                                    method: 'retrieve'
                                }
                            }
                        }
                    );
                },
                /The service of id "a" should define the registry method "retrieve"\./
            );
        })
    })

    describe('method "set"', function() {
        it('should replace an already instanciated service', function() {
            var storage = servicesContainer.set('storage.local', { name: 'local super storage' }),
                provider = servicesContainer.get('provider.bigImages')
            ;

            assert.equal('local super storage', provider.storages[0].name);
        })
    })

    describe('method "unset"', function() {
        it('should unset an instanciated service', function() {
            assert(servicesContainer.has('storage.local'));
            servicesContainer.unset('storage.local');
            assert(!servicesContainer.has('storage.local'));
        })
    })
})
