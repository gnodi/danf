'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    InterfacesContainer = require('../../../lib/common/object/interfaces-container'),
    Interfacer = require('../../../lib/common/object/interfacer'),
    ObjectProvider = require('../../../lib/common/dependency-injection/object-provider')
;

var Class = function(foo, bar) {
        this.foo = foo;
        this.bar = bar;
    }
;
Class.defineImplementedInterfaces(['interface']);
Class.prototype.public = function() {};
Class.prototype.private = function() {};

var interfacesContainer = new InterfacesContainer(),
    interfacer = new Interfacer(),
    objectProvider = new ObjectProvider()
;

interfacer.interfacesContainer = interfacesContainer;
objectProvider.interfacer = interfacer;
interfacesContainer.setDefinition(
    'interface',
    {
        methods: {
            public: {
                arguments: []
            }
        }
    }
);
objectProvider.class = Class;

describe('ObjectProvider', function() {
    it('method "provide" should provide a new object of the given class', function() {
        var obj1 = objectProvider.provide({foo: 2, bar: 3}),
            obj2 = objectProvider.provide({foo: 1, bar: 4})
        ;

        assert.equal(obj1.foo, 2);
        assert.equal(obj1.bar, 3);
        assert.equal(obj2.foo, 1);
        assert.equal(obj2.bar, 4);
    })

    it('should fail to check an not implemented interface if given for the class', function() {
        assert.throws(
            function() {
                objectProvider.interface = 'notImplementedInterface';

                objectProvider.__init();
            },
            /The provided object should be an "instance of `notImplementedInterface`"; an "instance of \[`interface`\]" given instead./
        );
    })

    it('should succeed to check an implemented interface if given for the class', function() {
        objectProvider.interface = 'interface';
    })

    it('should add a proxy of the interface to the provided object', function() {
        assert.throws(
            function() {
                var obj = objectProvider.provide();

                obj.public();
                obj.private();
            },
            /The method "private" is not accessible in the scope of the interface "interface"\./
        );
    })
})