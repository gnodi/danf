'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ModulesTree = require('../../../lib/common/configuration/modules-tree')
;

var modulesTree = new ModulesTree();

modulesTree.appName = 'app';

describe('ModulesTree', function() {
    describe('"build" method', function() {
        it('should build a tree of modules with a level of definition', function() {
            modulesTree.build(require('../../fixture/configuration/danf'));

            var modules = modulesTree.getLevel(1);
            assert.equal(modules[0].id, 'app:module1');
            assert.equal(modules[1].id, 'app:module2');

            modules = modulesTree.getLevel(2);
            assert.equal(modules[0].id, 'app:module1:module3');
        })
    })

    describe('"getRoot" method', function() {
        it('should retrieve the root module', function() {
            var module = modulesTree.getRoot();

            assert.equal(module.id, 'danf');
            assert(module.dependencies.app);
        })
    })

    describe('"getFlat" method', function() {
        it('should retrieve all the modules in a flat array without hierarchy', function() {
            var modules = modulesTree.getFlat();

            assert.equal(modules[0].id, 'danf');
            assert.equal(modules[1].id, 'app');
            assert.equal(modules[2].id, 'app:module1');
            assert.equal(modules[3].id, 'app:module2');
            assert.equal(modules[4].id, 'app:module1:module3');
        })
    })

    describe('"get" method', function() {
        it('should retrieve an existing module from its id', function() {
            var module = modulesTree.get('app:module1');

            assert(module);
            assert.equal(module.id, 'app:module1');
        })

        it('should retrieve an existing module from its id', function() {
            var module = modulesTree.get('app:module2');

            assert(module);
            assert.equal(module.id, 'app:module2');
        })

        it('should fail to retrieve a non-existing module', function() {
            assert.throws(
                function() {
                    modulesTree.get('app:module10');
                },
                /No module "app:module10" found./
            );
        })
    })

    describe('"getChild" method', function() {
        it('should retrieve an existing child module from a relative module id', function() {
            var module = modulesTree.getRoot().dependencies.app;

            var child = modulesTree.getChild(module, 'module1');
            assert.equal(child.id, 'app:module1');

            child = modulesTree.getChild(module, 'module2');
            assert.equal(child.id, 'app:module2');

            child = modulesTree.getChild(module, 'module1:module3');
            assert.equal(child.id, 'app:module1:module3');

            child = modulesTree.getChild(module, 'module4:module3');
            assert.equal(child.id, 'app:module1:module3');

            child = modulesTree.getChild(module, 'module1:module5');
            assert.equal(child.id, 'app:module1:module3');
        })

        it('should fail to retrieve a non-existing child module', function() {
            assert.throws(
                function() {
                    modulesTree.getChild(modulesTree.getRoot().dependencies.app, 'module1:module10');
                },
                /No child module "module10" found for the module "app:module1"./
            );
        })
    })
})