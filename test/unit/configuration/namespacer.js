'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ModulesTree = require('../../../lib/common/configuration/modules-tree'),
    Namespacer = require('../../../lib/common/configuration/namespacer'),
    ReferenceType = require('../../../lib/common/manipulation/reference-type')
;

var modulesTree = new ModulesTree(),
    namespacer = new Namespacer(),
    referenceType = new ReferenceType(),
    sizeReferenceType = new ReferenceType()
;

modulesTree.appName = 'main';

referenceType.name = 'param';
referenceType.delimiter = '%';

sizeReferenceType.name = 'size';
sizeReferenceType.delimiter = '$';
sizeReferenceType.size = 5;
sizeReferenceType.namespace = [1, 3];

namespacer.addReferenceType(referenceType);
namespacer.addReferenceType(sizeReferenceType);

var prefixTests = [
        {
            source: 'module1',
            module: 'main',
            expected: 'main:module1'
        },
        {
            source: 'module1:module3',
            module: 'main',
            expected: 'main:module1:module3'
        },
        {
            source: 'module3',
            module: 'main:module1',
            expected: 'main:module1:module3'
        },
        {
            source: 'module4:module3',
            module: 'main',
            expected: 'main:module1:module3'
        },
        {
            source: 'main:module2',
            module: 'main',
            expected: 'main:module2'
        },
        {
            source: 'main:module4:module3',
            module: 'main',
            expected: 'main:module4:module3'
        },
        {
            source: 'danf:module',
            module: 'main',
            expected: 'danf:module'
        }
    ]
;

var prefixReferencesTests = [
        {
            source: {
                a: 'a',
                b: '%b%',
                c: {
                    d: 'd',
                    e: '%e%',
                    f: '%module5:f%',
                    g: '%module5.g%'
                }
            },
            module: 'main:module1',
            type: 'param',
            expected: {
                a: 'a',
                b: '%main:module1:b%',
                c: {
                    d: 'd',
                    e: '%main:module1:e%',
                    f: '%main:module1:module3:f%',
                    g: '%main:module1:module5.g%'
                }
            }
        },
        {
            source: {a: '$a$b$c$d$e$'},
            module: 'main',
            type: 'size',
            expected: {a: '$a$main:b$c$main:d$e$'}
        },
        {
            source: '$a$b$c$d$e$',
            module: 'main',
            type: 'size',
            expected: '$a$main:b$c$main:d$e$'
        },
        {
            source: '%a',
            module: 'main',
            type: 'param',
            expected: '%a'
        },
        {
            source: '%a %b% c%d%e%',
            module: 'main',
            type: 'param',
            expected: '%a %main:b% c%main:d%e%'
        },
        {
            source: '%a %b% c%d%e%',
            module: 'main',
            type: 'size',
            expected: '%a %b% c%d%e%',
        }
    ]
;

modulesTree.build(require('../../fixture/configuration/danf'));

describe('Namespacer', function() {
    prefixTests.forEach(function(test) {
        it('method "prefix" should prefix a source', function() {
            var module = modulesTree.get(test.module),
                result = namespacer.prefix(test.source, module, modulesTree)
            ;

            assert.deepEqual(result, test.expected);
        })
    })

    prefixReferencesTests.forEach(function(test) {
        it('method "prefixReferences" should prefix the references of a source', function() {
            var module = modulesTree.get(test.module),
                result = namespacer.prefixReferences(
                    test.source,
                    test.type,
                    module,
                    modulesTree
                )
            ;

            assert.deepEqual(
                result,
                test.expected
            );
        })
    })
})