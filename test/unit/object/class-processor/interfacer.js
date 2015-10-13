'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    utils = require('../../../../lib/common/utils'),
    Interfacer = require('../../../../lib/common/object/class-processor/interfacer'),
    InterfacesContainer = require('../../../../lib/common/object/interfaces-container')
;

var MyClass = function() { this._value = 1 },
    interfaces = ['myInterface']
;
MyClass.defineImplementedInterfaces(interfaces);
MyClass.prototype.myMethod1 = function(myDependency) { return 1; };
MyClass.prototype.myMethod2 = function(myString, myNumber) { return 2; };
Object.defineProperty(MyClass.prototype, 'property1', {
    get: function() { return this._value; },
    set: function(value) { this._value = value; }
});
Object.defineProperty(MyClass.prototype, 'property2', {
    get: function() { return 2; }
});
Object.defineProperty(MyClass.prototype, 'property3', {
    set: function(value) {}
});

var MyNotImplementedMethodClass = function() {},
    MyNotImplementedGetterClass = function() {},
    MyNotImplementedSetterClass = function() {},
    MyBadClass = function() {}
;

MyNotImplementedMethodClass.defineImplementedInterfaces(['myNotImplementedMethodInterface']);
MyNotImplementedGetterClass.defineImplementedInterfaces(['myNotImplementedGetterInterface']);
MyNotImplementedSetterClass.defineImplementedInterfaces(['myNotImplementedSetterInterface']);
MyBadClass.defineImplementedInterfaces(['MyNonExistentInterface']);

var MyAbstractClass = function() { this._value = 1 };
MyAbstractClass.defineImplementedInterfaces(interfaces);
MyAbstractClass.prototype.myMethod2 = function(myString, myNumber) { return 2; };
Object.defineProperty(MyAbstractClass.prototype, 'property2', {
    get: function() { return 2; }
});
Object.defineProperty(MyAbstractClass.prototype, 'property3', {
    set: function(value) {}
});

var MyConcreteClass = function() {
    MyAbstractClass.call(this);
}
utils.extend(MyAbstractClass, MyConcreteClass);
MyConcreteClass.prototype.myMethod1 = function(myDependency) { return 1; };
Object.defineProperty(MyConcreteClass.prototype, 'property1', {
    get: function() { return this._value; },
    set: function(value) { this._value = value; }
});

var C = function() { this._value = 1 };
C.defineImplementedInterfaces(['c']);
Object.defineProperty(C.prototype, 'a', {
    value: 'a'
});
Object.defineProperty(C.prototype, 'b', {
    value: 'b'
});
Object.defineProperty(C.prototype, 'c', {
    value: 'c'
});

var interfacesContainer = new InterfacesContainer(),
    interfacer = new Interfacer()
;

interfacer.interfacesContainer = interfacesContainer;

var config = {
        interfaces: {
            myInterface: {
                methods: {
                    myMethod1: {
                        arguments: ['myInterface']
                    },
                    myMethod2: {
                        arguments: ['string', 'number|string/foo'],
                        returns: 'string'
                    }
                },
                getters: {
                    property1: 'number',
                    property2: 'string'
                },
                setters: {
                    property1: 'number',
                    property3: 'string'
                }
            },
            myNotImplementedMethodInterface: {
                methods: {
                    myMethod3: {
                        arguments: []
                    },
                }
            },
            myNotImplementedGetterInterface: {
                getters: {
                    property4: 'number'
                }
            }
            ,
            myNotImplementedSetterInterface: {
                setters: {
                    property5: 'string'
                }
            },
            a: {
                getters: { a: 'string' }
            },
            b: {
                extends: 'a',
                getters: { b: 'string' }
            },
            c: {
                extends: 'b',
                getters: { c: 'string' }
            }
        }
    }
;

describe('Interfacer', function() {
    describe('method "process"', function() {
        interfacesContainer.handleRegistryChange(config['interfaces']);

        it('process a class with a defined interfaces without any error', function() {
            interfacer.process(MyClass);
        })

        it('should process interfaces inheritance correctly', function() {
            interfacer.process(C);

            assert.deepEqual(C.__metadata.implements, ['c', 'b', 'a']);
        })

        describe('should fail to', function() {
            it('process a class with a not defined interface', function() {
                assert.throws(
                    function() {
                        interfacer.process(MyBadClass);
                    },
                    /The interface "MyNonExistentInterface" is not defined./
                );
            })

            it('check a class with a missing method to implement', function() {
                assert.throws(
                    function() {
                        interfacer.process(MyNotImplementedMethodClass);
                    },
                    /The method "myMethod3" defined by the interface "myNotImplementedMethodInterface" must be implemented./
                );
            })

            it('check a class with a getter method to implement', function() {
                assert.throws(
                    function() {
                        interfacer.process(MyNotImplementedGetterClass);
                    },
                    /The getter "property4" defined by the interface "myNotImplementedGetterInterface" must be implemented./
                );
            })

            it('check a class with a missing setter to implement', function() {
                assert.throws(
                    function() {
                        interfacer.process(MyNotImplementedSetterClass);
                    },
                    /The setter "property5" defined by the interface "myNotImplementedSetterInterface" must be implemented./
                );
            })
        })

        it('should works with javascript inheritance', function() {
            var interfaces = ['myInterface'];

            assert.throws(
                function() {
                    interfacer.process(MyAbstractClass);
                },
                Error
            );

            interfacer.process(MyConcreteClass);

            var obj = new MyConcreteClass(),
                dependencyObj = new MyClass()
            ;

            assert.equal(obj.myMethod1(dependencyObj), 1);
            assert.equal(obj.property1, 1);
            obj.property1 = 2;
            assert.equal(obj.property1, 2);
        })
    })
})