'use strict';

require('../../lib/common/init');

var assert = require('assert'),
    utils = require('../../lib/common/utils')
;

var func = function() { return; },
    Class = function() {},
    BadClass = function() {}
;

Class.defineImplementedInterfaces(['interface']);
BadClass.defineImplementedInterfaces(['badInterface']);

var checkTypeTests = [
        {type: 'string', data: 'foo'},
        {type: 'number', data: 2},
        {type: 'boolean', data: true},
        {type: 'function', data: func},
        {type: 'date', data: new Date()},
        {type: 'error', data: new Error()},
        {type: 'array', data: ['foo', 2]},
        {type: 'object', data: {foo: '3', bar: 2}},
        {type: 'null', data: null},
        {type: 'undefined'},
        {type: 'mixed', data: {foo: 2, bar: ['foo', 4, {foo: 'bar'}]}},
        {type: 'string_array', data: ['foo', 'bar']},
        {type: 'number_array', data: [3]},
        {type: 'boolean_array', data: [false, true]},
        {type: 'function_array', data: [func, func]},
        {type: 'date_array', data: [new Date(), new Date()]},
        {type: 'error_array', data: [new Error(), new Error()]},
        {type: 'mixed_array', data: [func, 2, {foo: [1]}]},
        {type: 'number_array_array', data: [[1, 2], [3]]},
        {type: 'string_array_array', data: [['foo'], ['bar']]},
        {type: 'boolean_array_array', data: [[true, false], [true]]},
        {type: 'mixed_array_array', data: [[func, 2, {foo: [1]}], []]},
        {type: 'string_object', data: {foo: 'bar', bar: 'foo'}},
        {type: 'number_object', data: {foo: 2, bar: 1}},
        {type: 'boolean_object', data: {foo: true, bar: false}},
        {type: 'function_object', data: {foo: func, bar: func}},
        {type: 'date_object', data: {foo: new Date(), bar: new Date()}},
        {type: 'error_object', data: {foo: new Error(), bar: new Error()}},
        {type: 'mixed_object', data: {foo: 45, bar: {foo: 'bar'}}},
        {type: 'number_array_object', data: {foo: [2, 3, 4], bar: [5]}},
        {type: 'string_array_object', data: {foo: ['foo', 'bar'], bar: []}},
        {type: 'boolean_array_object', data: {foo: [true, false], bar: []}},
        {type: 'mixed_array_object', data: {foo: [1, 'bar'], bar: []}},
        {type: 'mixed', data: {foo: 2, bar: ['foo', 4, {foo: 'bar'}]}},
        {type: 'string_array|undefined', data: ['foo', 'bar'], expected: 'string_array'},
        {type: 'string_array|undefined', expected: 'undefined'},
        {type: 'interface', data: new Class()},
        {type: 'interface_array', data: [new Class(), new Class()]},
        {type: 'interface_array', data: []},
        {type: 'interface_object', data: {foo: new Class(), bar: new Class()}},
        {type: 'interface_object', data: {}},
        {type: 'string_array', data: []},
        {type: 'number', data: '2', interpret: 2},
        {type: 'boolean_array_object', data: {foo: [2, '3', false, 0], bar: ['0']}, interpret: {foo: [true, true, false, false], bar: [false]}}
    ]
;

var checkTypeErrorTests = [
        {
            data: 1,
            type: 'string',
            expected: /The expected value is a "string"; a "number" of value `1` given instead./
        },
        {
            data: 'bar',
            type: 'number',
            name: 'foo1',
            expected: /The expected value for "foo1" is a "number"; a "string" of value `"bar"` given instead./
        },
        {
            data: 1,
            type: 'boolean',
            name: 'foo2',
            expected: /The expected value for "foo2" is a "boolean"; a "number" of value `1` given instead./
        },
        {
            data: 1,
            type: 'function',
            name: 'foo3',
            expected: /The expected value for "foo3" is a "function"; a "number" of value `1` given instead./
        },
        {
            data: 1,
            type: 'string_array',
            name: 'foo4',
            expected: /The expected value for "foo4" is a "string_array"; a "number" of value `1` given instead./
        },
        {
            data: ['foo', 'bar'],
            type: 'number_array',
            name: 'foo5',
            expected: /The expected value for "foo5" is a "number_array"; a "string_array" of value `\["foo","bar"\]` given instead./
        },
        {
            data: 1,
            type: 'string_object',
            name: 'foo6',
            expected: /The expected value for "foo6" is a "string_object"; a "number" of value `1` given instead./
        },
        {
            data: {foo: 1},
            type: 'boolean_object',
            name: 'foo7',
            expected: /The expected value for "foo7" is a "boolean_object"; a "number_object" of value `{"foo":1}` given instead./
        },
        {
            data: 1,
            type: 'mixed_object',
            name: 'foo8',
            expected: /The expected value for "foo8" is a "mixed_object"; a "number" of value `1` given instead./
        },
        {
            data: {bar: 1},
            type: 'number_array_object',
            name: 'foo9',
            expected: /The expected value for "foo9" is a "number_array_object"; a "number_object" of value `{"bar":1}` given instead./
        },
        {
            data: {bar: [1]},
            type: 'string_array_object',
            name: 'foo10',
            expected: /The expected value for "foo10" is a "string_array_object"; a "number_array_object" of value `{"bar":\[1\]}` given instead./
        },
        {
            data: 1,
            type: 'mixed_array_object',
            name: 'foo11',
            expected: /The expected value for "foo11" is a "mixed_array_object"; a "number" of value `1` given instead./
        },
        {
            data: {},
            type: 'array',
            name: 'foo12',
            expected: /The expected value for "foo12" is an "array"; an "object" of value `{}` given instead./
        },
        {
            data: [],
            type: 'object',
            name: 'foo13',
            expected: /The expected value for "foo13" is an "object"; an "array" of value `\[\]` given instead./
        },,
        {
            data: [],
            type: 'object',
            name: 'foo14',
            expected: /The expected value for "foo14" is an "object"; an "array" of value `\[\]` given instead./
        },
        {
            data: [],
            type: 'interface',
            name: 'foo15',
            expected: /The expected value for "foo15" is an "instance of `interface`"; an "array" of value `\[\]` given instead./
        },
        {
            data: new BadClass(),
            type: 'interface',
            name: 'foo16',
            expected: /The expected value for "foo16" is an "instance of `interface`"; an "instance of \[`badInterface`\]" given instead./
        },
        {
            data: true,
            type: 'number|string',
            name: 'foo17',
            expected: /The expected value for "foo17" is a "number" or a "string"; a "boolean" of value `true` given instead./
        },
        {
            data: 2,
            type: 'interface_array',
            name: 'foo18',
            expected: /The expected value for "foo18" is an "array of instance of `interface` values"; a "number" of value `2` given instead./
        },
        {
            data: [new Class()],
            type: 'interface_object',
            name: 'foo19',
            expected: /The expected value for "foo19" is an "object of instance of `interface` properties"; an "object_array" of value `\[{}\]` given instead./
        },
        {
            data: {foo: new Class(), bar: new BadClass()},
            type: 'interface_object',
            name: 'foo20',
            expected: /The expected value for "foo20" is an "object of instance of `interface` properties"; an "object_object" of value `{"foo":{},"bar":{}}` given instead./
        },
        {
            data: 3,
            type: 'date',
            name: 'foo21',
            expected: /The expected value for "foo21" is a "date"; a "number" of value `3` given instead./
        },
        {
            data: 'foo',
            type: 'error',
            name: 'foo22',
            expected: /The expected value for "foo22" is an "error"; a "string" of value `"foo"` given instead./
        }
    ]
;

var getTypeTests = [
        {value: 1, expected: 'number'},
        {value: '2', expected: 'string'},
        {value: null, expected: 'null'},
        {expected: 'undefined'},
        {value: [1, 2], expected: 'number_array'},
        {value: ['2', 1], expected: 'mixed_array'},
        {value: {foo: 1, bar: 2}, expected: 'number_object'},
        {value: {foo: '2', bar: 1}, expected: 'mixed_object'},
        {value: [[1],[2]], expected: 'number_array_array'},
        {value: [[1],['2']], expected: 'mixed_array_array'},
        {value: [{foo: 1}, {bar: 2}], expected: 'number_object_array'},
        {value: [{foo: '2'}, {bar: 1}], expected: 'mixed_object_array'},
        {value: {foo: [1], bar: [2]}, expected: 'number_array_object'},
        {value: {foo: ['2'], bar: [1]}, expected: 'mixed_array_object'},
        {value: {foo: {foo: 1}, bar: {bar: 2}}, expected: 'number_object_object'},
        {value: {foo: {foo: '2'}, bar: {bar: 1}}, expected: 'mixed_object_object'},
        {value: {foo: {foo: [1]}, bar: {bar: [2]}}, expected: 'mixed_object_object'},
        {value: [], expected: 'array'},
        {value: {}, expected: 'object'},
        {value: {foo: [1, 3], bar: 2}, expected: 'mixed_object'},
        {value: {foo: [1, 3], bar: ['2']}, expected: 'mixed_array_object'},
        {value: {foo: [1, 3], bar: []}, expected: 'number_array_object'}
    ]
;

describe('Object', function() {
    checkTypeTests.forEach(function(test) {
        it('method "checkType" should return the type if the value has one of the given types', function() {
            var data = utils.clone(test.data),
                results = Object.checkType(
                    data,
                    test.type,
                    undefined !== test.interpret ? true : false
                )
            ;

            assert.equal(results.matchedType, test.expected ? test.expected : test.type);
            // Check the data is not modified.
            assert.deepEqual(data, test.data);

            if (undefined !== test.interpret) {
                assert.deepEqual(results.interpretedValue, test.interpret);
            }
        })
    })

    checkTypeErrorTests.forEach(function(test) {
        it('method "checkType" should throw an error if the value has not one of the given types', function() {
            assert.throws(
                function() {
                    Object.checkType(
                        test.data,
                        test.type,
                        test.interpret,
                        test.name
                    );
                },
                test.expected
            );
        })
    });

    getTypeTests.forEach(function(test) {
        it('method "getType" should return the type of a value', function() {
            var type = Object.getType(test.value);

            assert.equal(type, test.expected);
        })
    })

    describe('method "checkDependencies"', function() {
        var A = function() {};
        var B = function() {};

        it('should succeed to check dependencies', function() {
            A.defineDependency('b', 'main:b');

            B.defineImplementedInterfaces(['main:b']);

            var a = new A(),
                b = new B()
            ;
            a.b = b;

            a.__metadata = A.__metadata;
            b.__metadata = B.__metadata;

            Object.checkDependencies(a);
        })

        it('should succeed to check dependencies with provided dependencies', function() {
            A.defineDependency('b', 'main:b', 'main.c');

            B.prototype.providedType = 'main.c';

            var a = new A(),
                b = new B()
            ;
            a.b = b;

            a.__metadata = A.__metadata;
            b.__metadata = B.__metadata;

            Object.checkDependencies(a);
        })

        it('should throw an error if the type of the dependency is not the expected one', function() {
            assert.throws(
                function() {
                    A.defineDependency('b', 'main:c');

                    var a = new A(),
                        b = new B()
                    ;
                    a.b = b;

                    a.__metadata = A.__metadata;
                    a.__metadata.id = 'a';
                    b.__metadata = B.__metadata;

                    Object.checkDependencies(a);
                },
                /The object "a" expected an "instance of `main:c`" for its property "b"; an "instance of \[`main:b`\]" given instead./
            );
        })

        it('should throw an error if the type of the dependency is not the expected one', function() {
            assert.throws(
                function() {
                    A.defineDependency('b', 'string', 'main:c');

                    var a = new A();
                    a.b = 'dumb';

                    delete A.__metadata.id;
                    a.__metadata = A.__metadata;

                    Object.checkDependencies(a);
                },
                /The object expected a provider of "main:c" for its property "b"; a "string" of value `"dumb"` given instead./
            );
        })

        it('should throw an error if the value has not one of the given types', function() {
            assert.throws(
                function() {
                    A.defineDependency('b', 'main:b', 'main:c');

                    B.prototype.providedType = null;

                    var a = new A(),
                        b = new B()
                    ;
                    a.b = b;

                    a.__metadata = A.__metadata;
                    b.__metadata = B.__metadata;

                    Object.checkDependencies(a);
                },
                /The object expected a provider of "main:c" for its property "b"; an "instance of \[`main:b`\]" with no "providedType" getter given instead./
            );
        })

        it('should throw an error if the value has not one of the given types', function() {
            assert.throws(
                function() {
                    B.prototype.providedType = 'main:d';

                    var a = new A(),
                        b = new B()
                    ;
                    a.b = b;

                    a.__metadata = A.__metadata;
                    b.__metadata = B.__metadata;

                    Object.checkDependencies(a);
                },
                /The object expected a provider of "main:c" for its property "b"; a provider of "main:d" given instead./
            );
        })
    })
})