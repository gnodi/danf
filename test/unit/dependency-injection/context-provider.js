'use strict';

require('../../../lib/init');

var assert = require('assert'),
    InterfacesRegistry = require('../../../lib/common/object/interfaces-registry'),
    Interfacer = require('../../../lib/common/object/interfacer'),
    ContextProvider = require('../../../lib/common/dependency-injection/context-provider')
;

var Class = function(foo, bar) {
        this.foo = foo;
        this.bar = bar;
    }
;
Class.defineImplementedInterfaces(['interface']);
Class.prototype.public = function() {};
Class.prototype.private = function() {};

var interfacesRegistry = new InterfacesRegistry(),
    interfacer = new Interfacer(),
    contextProvider = new ContextProvider()
;

interfacer.interfacesRegistry = interfacesRegistry;
contextProvider.interfacer = interfacer;
interfacesRegistry.index(
    'interface',
    {
        methods: {
            public: {
                arguments: []
            }
        }
    }
);

describe('ContextProvider', function() {
    it('method "provide" should fail to provide an empty context', function() {
        assert.throws(
            function() {
                contextProvider.provide();
            },
            /The context is empty./
        );
    })

    it('method "provide" should provide a set context', function() {
        var context = {
                a: 2,
                b: 3
            }
        ;

        contextProvider.set(context);

        assert.deepEqual(contextProvider.provide(), context);

        context = {
                c: 1,
                d: 4
            }
        ;

        contextProvider.set(context);

        assert.deepEqual(contextProvider.provide(), context);
    })

    it('method "provide" should fail to provide an empty context', function() {
        assert.throws(
            function() {
                contextProvider.unset();
                contextProvider.provide();
            },
            /The context is empty\./
        );
    })

    it('method "set" should fail to set a context which do not implement the given interface', function() {
        assert.throws(
            function() {
                contextProvider.interface = 'otherInterface';
                contextProvider.set(new Class());
            },
            /The context object should be an "instance of `otherInterface`"; an "instance of \[`interface`\]" given instead\./
        );
    })

    it('method "set" should succeed in setting a context which implement the given interface', function() {
        Class.defineImplementedInterfaces(['interface']);
        contextProvider.interface = 'interface';
        contextProvider.set(new Class());
    })

    it('should add a proxy of the interface to the provided context object', function() {
        assert.throws(
            function() {
                var obj = contextProvider.provide();

                obj.public();
                obj.private();
            },
            /The method "private" is not accessible in the scope of the interface "interface"\./
        );
    })
})