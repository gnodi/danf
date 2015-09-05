'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    utils = require('../../../lib/common/utils'),
    ModulesTree = require('../../../lib/common/configuration/modules-tree'),
    ReferenceResolver = require('../../../lib/common/manipulation/reference-resolver'),
    Namespacer = require('../../../lib/common/configuration/namespacer'),
    SectionProcessor = require('../../../lib/common/configuration/section-processor')
;

var configurationResolver = require('../../fixture/configuration/configuration-resolver'),
    referenceResolver = new ReferenceResolver(),
    namespacer = new Namespacer()
;

var contract = {
    providers: {
        type: 'embedded_object',
        embed: {
            codes: {
                type: 'number_array'
            },
            active: {
                type: 'boolean',
                default: false
            },
            rules: {
                type: 'embedded_array',
                embed: {
                    name: {
                        type: 'string',
                        required: true
                    },
                    params: {
                        type: 'mixed'
                    }
                }
            }
        }
    },
    size: {
        type: 'number',
    },
    terms: {
        type: 'string_array'
    },
    properties: {
        type: 'mixed_object'
    },
    methods: {
        type: 'number_array_object'
    },
    raw: {
        type: function(value) {
            return value ? true : false;
        }
    }
};

var modulesTree = new ModulesTree('main');

modulesTree.appName = 'main';
modulesTree.build(
    {
        dependencies: {
            my_submodule1: {
                dependencies: {
                    my_submodule10: {
                        config: {
                            this: {
                                size: 10
                            }
                        }
                    }
                },
                config: {
                    my_submodule10: {
                        providers: {
                            big_images: {
                                codes: [123, 256],
                                active: true,
                                rules: [{
                                    name: 'size',
                                    params: {
                                        min: 4
                                    }
                                }, {
                                    name: 'existence',
                                    params: null
                                }]
                            }
                        },
                        terms: [
                            'condition1',
                            'condition2',
                            'condition3'
                        ],
                        raw: 1
                    }
                }
            },
            my_submodule2: {
                dependencies: {
                    my_submodule10: {
                        config: {
                            this: {
                                size: 20
                            }
                        }
                    }
                },
                config: {
                    my_submodule10: {
                        providers: {
                            images: {
                                codes: [124, 256],
                                active: true,
                                rules: [{
                                    name: 'size',
                                    params: {
                                        min: 1,
                                        max: 3
                                    }
                                }, {
                                    name: 'existence',
                                    params: null
                                }]
                            }
                        },
                        raw: 2
                    }
                }
            },
            'my_submodule2:my_submodule10': 'my_submodule1:my_submodule10'
        },
        config: {
            'my_submodule1:my_submodule10': {
                providers: {
                    images: {
                        codes: [123, 256],
                        active: true,
                        rules: [{
                            name: 'size',
                            params: {
                                min: 2,
                                max: 3
                            }
                        }, {
                            name: 'existence',
                            params: null
                        }]
                    },
                    videos: {
                        codes: [],
                        rules: [{
                            name: 'type',
                            params: 'mpeg'
                        }]
                    }
                },
                properties: {
                    backgroundColor: { r: 50, g: 100, b: 150 },
                    width: 1920,
                    height: 1080
                },
                methods: {
                    setBlue: [0, 0, 255],
                    setYellow: [255, 255, 0]
                },
                raw: 3
            }
        }
    }
);

var expectedConfig = {
    providers: {
        images: {
            codes: [123, 256],
            active: true,
            rules: [{
                name: 'size',
                params: {
                    min: 2,
                    max: 3
                }
            }, {
                name: 'existence',
                params: null
            }]
        },
        videos: {
            codes: [],
            active: false,
            rules: [{
                name: 'type',
                params: 'mpeg'
            }]
        },
        big_images: {
            codes: [123, 256],
            active: true,
            rules: [{
                name: 'size',
                params: {
                    min: 4
                }
            }, {
                name: 'existence',
                params: null
            }]
        }
    },
    terms: [
        'condition1',
        'condition2',
        'condition3'
    ],
    properties: {
        backgroundColor: { r: 50, g: 100, b: 150 },
        width: 1920,
        height: 1080
    },
    methods: {
        setBlue: [0, 0, 255],
        setYellow: [255, 255, 0]
    },
    raw: 3,
    size: 10
};

var sectionProcessor = new SectionProcessor();

sectionProcessor.name = 'main:my_submodule1:my_submodule10';
sectionProcessor.contract = contract;
sectionProcessor.configurationResolver = configurationResolver;
sectionProcessor.referenceResolver = referenceResolver;
sectionProcessor.namespacer = namespacer;

describe('Section Processor', function() {
    describe('"process" method', function() {
        var config = {};

        it('should return an object', function() {
            config = sectionProcessor.process(modulesTree, 'dev');
            assert.equal(typeof config, 'object');
        })

        it('should merge and interprete configurations', function() {
            assert.deepEqual(config, expectedConfig);
        })

        it('should handle environment configurations', function() {
            var sectionProcessor = new SectionProcessor();

            sectionProcessor.name = 'env';
            sectionProcessor.contract = {value: {type: 'number'}};
            sectionProcessor.configurationResolver = configurationResolver;
            sectionProcessor.referenceResolver = referenceResolver;
            sectionProcessor.namespacer = namespacer;

            modulesTree.build({
                config: {
                    env: {
                        value: 2
                    },
                    'env/dev': {
                        value: 3
                    }
                }
            });

            var envConfig = sectionProcessor.process(modulesTree, 'dev');

            assert.deepEqual(
                envConfig,
                {value: 3}
            );
        })
    })
})