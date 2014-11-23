'use strict';

require('../../lib/init');

var assert = require('assert'),
    utils = require('../../lib/utils'),
    Interfacer = require('../../lib/object/interfacer'),
    InterfacesIndexer = require('../../lib/object/interfaces-indexer')
;

var MyClass = function() { this._value = 1 },
    interfaces = ['myInterface']
;
MyClass.defineImplementedInterfaces(interfaces);
MyClass.prototype.myMethod1 = function(myDependency) { return 1; };
MyClass.prototype.myMethod2 = function(myString, myNumber) { return 2; };
MyClass.prototype.myMethod3 = function() { return arguments.length; };
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

var interfacesIndexer = new InterfacesIndexer(),
    interfacer = new Interfacer(interfacesIndexer)
;

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
                    },
                    myMethod3: {
                        arguments: ['string', 'number...|string...|boolean', 'array...|boolean|undefined', 'boolean|undefined'],
                        returns: 'number'
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
            },
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
    describe('method "addProxy" returns a proxy on the given object', function() {
        var obj = new MyClass();

        interfacesIndexer.processConfiguration(config['interfaces']);

        it('in order to expose only the given interface', function() {
            obj = interfacer.addProxy(obj, 'myInterface');

            assert(obj.isProxy);
            assert.equal(obj.property1, 1);
        })

        describe('which prevent', function() {
            describe('to call a method', function() {
                it('if the number of passed arguments is wrong', function() {
                    assert.throws(
                        function() {
                            obj.myMethod2('dumb');
                        },
                        /The method "myMethod2" defined by the interface "myInterface" takes 2 arguments; 1 given instead./
                    );
                })

                it('if one of the arguments of a method has a wrong type', function() {
                    // Standard case.
                    assert.throws(
                        function() {
                            obj.myMethod2(1, 2);
                        },
                        /The method "myMethod2" defined by the interface "myInterface" takes a "string" as argument 0; a "number" given instead./
                    );
                    assert.throws(
                        function() {
                            obj.myMethod2('foo', true);
                        },
                        /The method "myMethod2" defined by the interface "myInterface" takes a "number" or a "string" as argument 1 \(foo\); a "boolean" given instead./
                    );
                    assert.throws(
                        function() {
                            obj.myMethod2('foo', 2);
                        },
                        /The method "myMethod2" defined by the interface "myInterface" returns a "string"; a "number" given instead./
                    );
                })

                it('if one of the arguments of a method has a wrong type', function() {
                    // Variable parameters case.
                    assert.equal(obj.myMethod3('foo', true), 2);
                    assert.equal(obj.myMethod3('foo', 2), 2);
                    assert.equal(obj.myMethod3('foo', 3, true), 3);
                    assert.equal(obj.myMethod3('foo', 2, 3, 4, false), 5);
                    assert.equal(obj.myMethod3('foo', 'bar', 'foo'), 3);
                    assert.equal(obj.myMethod3('foo', 'bar', 'foo', [], [], true), 6);

                    assert.throws(
                        function() {
                            obj.myMethod3('foo', 'bar', 2, false);
                        },
                        /The method "myMethod3" defined by the interface "myInterface" takes an "array" or a "boolean" or "undefined" or a "string" as argument 2; a "number" given instead./
                    );
                    assert.throws(
                        function() {
                            obj.myMethod3('foo', 'bar', [], 'foo', false);
                        },
                        /The method "myMethod3" defined by the interface "myInterface" takes a "boolean" or "undefined" or an "array" as argument 3; a "string" given instead./
                    );
                })

                it('if an object does not implement the required interface', function() {
                    assert.throws(
                        function() {
                            var dependencyObj = new MyNotImplementedMethodClass();

                            obj.myMethod1(dependencyObj);
                        },
                        /The method "myMethod1" defined by the interface "myInterface" takes an "instance of `myInterface`" as argument 0; an "instance of \[`myNotImplementedMethodInterface`\]" given instead./
                    );
                })

                it('if it is not defined by the interface', function() {
                    assert.throws(
                        function() {
                            var obj = new MyClass();

                            obj.myMethod4 = function() {
                                return true;
                            };
                            obj = interfacer.addProxy(obj, 'myInterface');

                            obj.myMethod4();
                        },
                        /The method "myMethod4" is not accessible in the scope of the interface "myInterface"./
                    );
                })
            })

            describe('to call a getter', function() {
                it('if the return has a wrong type', function() {
                    assert.throws(
                        function() {
                            obj.property2;
                        },
                        /The getter "property2" defined by the interface "myInterface" returns a "string"; a "number" given instead./
                    );
                })

                it('if it is not defined by the interface', function() {
                    assert.throws(
                        function() {
                            var obj = new MyClass();

                            obj.property4 = 4;
                            obj = interfacer.addProxy(obj, 'myInterface');

                            obj.property4;
                        },
                        /The getter of the property "property4" is not accessible in the scope of the interface "myInterface"./
                    );
                })
            })

            describe('to call a setter', function() {
                it('if the value given to a setter has a wrong type', function() {
                    assert.throws(
                        function() {
                            obj.property1 = 'foo';
                        },
                        /The setter "property1" defined by the interface "myInterface" takes a "number"; a "string" given instead./
                    );
                })

                it('if it is not defined by the interface', function() {
                    assert.throws(
                        function() {
                            var obj = new MyClass();

                            obj.property4 = 4;
                            obj = interfacer.addProxy(obj, 'myInterface');

                            obj.property4 = 2;
                        },
                        /The setter of the property "property4" is not accessible in the scope of the interface "myInterface"./
                    );
                })
            })
        })

        it('which work with interfaces inheritance', function() {
            var c = new C();

            c = interfacer.addProxy(c, 'c');

            assert(c.isProxy);
            assert.equal(c.c, 'c');
            assert.equal(c.b, 'b');
            assert.equal(c.a, 'a');
        })
    })
})