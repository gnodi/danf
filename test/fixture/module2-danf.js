'use strict';

var Manager = function() { this.name = 'manager'; }
Manager.defineImplementedInterfaces(['module10:manager']);

module.exports = {
    dependencies: {
        module10: require('./module10-v2-danf'),
        module11: require('./module10-v2-danf')
    },
    contract: {
        providers: {
            type: 'embedded_object',
            embed: {
                rules: {
                    type: 'embedded_object',
                    embed: {
                        parameters: {
                            type: 'embedded_array',
                            embed: {
                                type: {
                                    type: 'string'
                                },
                                value: {
                                    type: 'mixed'
                                }
                            }
                        }
                    }
                },
                storages: {
                    type: 'string_array'
                },
                adapter: {
                    type: 'string'
                }
            }
        },
        timeOut: {
            type: 'number'
        }
    },
    config: {
        classes: {
            manager: Manager
        },
        services: {
            manager: {
                class: Manager,
                properties: {
                    providers: '&provider&',
                    timeOut: '$module11:timeOut$',
                    try: '$module10:module100:try$'
                }
            },
            provider: {
                class: function() { this.name = 'provider'; },
                declinations: '$providers$',
                properties: {
                    storages: '#storage.@storages@#',
                    adapter: '#@adapter@#'
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
                        class:  function() { this.name = 'rule minSize'; },
                        abstract: true
                    },
                    maxSize: {
                        class:  function() { this.name = 'rule maxSize'; },
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
            storage: {
                children: {
                    local: {
                        class: function() { this.name = 'local storage'; }
                    },
                    remote: {
                        class: function() { this.name = 'remote storage'; }
                    }
                }
            }
        },
        this: {
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
                                    value: 3
                                }, {
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
                                }, {
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
            timeOut: 1000
        }
    }
};