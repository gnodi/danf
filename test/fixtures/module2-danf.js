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
                                    type: 'free'
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
                    rules: '>rule.@rules@>provider>@@rules.@rules@@@>',
                    storages: '#storage.@storages@#',
                    adapter: '#@adapter@#'
                },
                tags: ['provider']
            },
            rule: {
                factories: {
                    provider: {
                        properties: {
                            parameters: '>parameter.@parameters.type@>rule>@@parameters.@parameters@@@>'
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
            'parameter.size': {
                class: function() { this.name = 'parameter size'; },
                abstract: true,
                factories: {
                    rule: {
                        properties: {
                            value: '@value@'
                        }
                    }
                }
            },
            'parameter.unit': {
                class: function() { this.name = 'parameter unit'; },
                abstract: true,
                factories: {
                    rule: {
                        properties: {
                            value: '@value@'
                        }
                    }
                }
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