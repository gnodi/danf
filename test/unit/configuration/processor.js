'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ModulesTree = require('../../../lib/common/configuration/modules-tree'),
    ReferenceResolver = require('../../../lib/common/manipulation/reference-resolver'),
    Namespacer = require('../../../lib/common/configuration/namespacer'),
    Processor = require('../../../lib/common/configuration/processor'),
    GlobalSectionProcessor = require('../../fixture/configuration/section-processor')
;

var modulesTree = new ModulesTree(),
    configurationResolver = require('../../fixture/configuration/configuration-resolver'),
    referenceResolver = new ReferenceResolver(),
    namespacer = new Namespacer(),
    processor = new Processor(),
    globalSectionProcessor = new GlobalSectionProcessor('global', configurationResolver, referenceResolver)
;

modulesTree.appName = 'main';

processor.configurationResolver = configurationResolver;
processor.referenceResolver = referenceResolver;
processor.namespacer = namespacer;
processor.environment = 'test';

var expectedConfig = {
        global: {
            value: 5
        },
        'danf': {},
        'main:module1': {
            test: {
                value: 0,
                text: 'text'
            },
            value: 1
        },
        'main:module2': {
            test: 2
        },
        'main:module1:module3': {
            value: 5,
            foo: 'bar'
        },
        main: {
            test: 0
        }
    }
;

modulesTree.build(require('../../fixture/configuration/danf'));
processor.addSectionProcessor(globalSectionProcessor);

describe('Processor', function() {
    describe('"process" method', function() {
        it('should merge and process the configuration of a module and its submodules', function(){
            var config = processor.process(modulesTree);

            assert.deepEqual(config, expectedConfig);
        })
    })
})