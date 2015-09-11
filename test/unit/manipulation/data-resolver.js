'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    dataResolver = require('../../fixture/manipulation/data-resolver'),
    func = function() { return; }
;

var resolveTests = [
        {
            data: {
                foo: 1
            },
            contract: {
                foo: {
                    type: 'number'
                }
            },
            expected: {
                foo: 1
            }
        },
        {
            data: {
                a: 'foo',
                b: 2,
                c: true,
                d: func,
                e: ['foo', 'bar'],
                f: [3],
                g: [false, true],
                h: [func, func],
                i: [func, 2, {foo: [1]}],
                j: [[1, 2], [3]],
                k: [['foo'], ['bar']],
                l: [[func, 2, {foo: [1]}], []],
                m: {foo: 'bar', bar: 'foo'},
                n: {foo: 2, bar: 1},
                o: {foo: true, bar: false},
                p: {foo: func, bar: func},
                q: {foo: 45, bar: {foo: 'bar'}},
                r: {foo: [2, 3, 4], bar: [5]},
                s: {foo: ['foo', 'bar'], bar: []},
                t: {foo: [1, 'bar'], bar: []},
                u: {foo: 2, bar: ['foo', 4, {foo: 'bar'}]},
                v: 'foo',
                w: 2
            },
            contract: {
                a: {type: 'string'},
                b: {type: 'number'},
                c: {type: 'boolean'},
                d: {type: 'function'},
                e: {type: 'string_array'},
                f: {type: 'number_array'},
                g: {type: 'boolean_array'},
                h: {type: 'function_array'},
                i: {type: 'mixed_array'},
                j: {type: 'number_array_array'},
                k: {type: 'string_array_array'},
                l: {type: 'mixed_array_array'},
                m: {type: 'string_object'},
                n: {type: 'number_object'},
                o: {type: 'boolean_object'},
                p: {type: 'function_object'},
                q: {type: 'mixed_object'},
                r: {type: 'number_array_object'},
                s: {type: 'string_array_object'},
                t: {type: 'mixed_array_object'},
                u: {type: 'mixed'},
                v: {type: 'number|string'},
                w: {type: 'number|string'}
            },
            expected: {
                a: 'foo',
                b: 2,
                c: true,
                d: func,
                e: ['foo', 'bar'],
                f: [3],
                g: [false, true],
                h: [func, func],
                i: [func, 2, {foo: [1]}],
                j: [[1, 2], [3]],
                k: [['foo'], ['bar']],
                l: [[func, 2, {foo: [1]}], []],
                m: {foo: 'bar', bar: 'foo'},
                n: {foo: 2, bar: 1},
                o: {foo: true, bar: false},
                p: {foo: func, bar: func},
                q: {foo: 45, bar: {foo: 'bar'}},
                r: {foo: [2, 3, 4], bar: [5]},
                s: {foo: ['foo', 'bar'], bar: []},
                t: {foo: [1, 'bar'], bar: []},
                u: {foo: 2, bar: ['foo', 4, {foo: 'bar'}]},
                v: 'foo',
                w: 2
            }
        },
        {
            data: {
                a: {
                    aa: 1,
                    ab: []
                },
                b: [
                    {
                        ba: 2,
                        bb: ['foo']
                    },
                    {
                        ba: 3,
                        bb: ['bar']
                    }
                ],
                c: {
                    a: {
                        ca: 4,
                        cb: ['foo', 'bar']
                    },
                    b: {
                        ca: 5,
                        cb: ['foo']
                    }
                },
                d: {
                    a: [
                        {
                            da: 4,
                            db: ['foo', 'bar']
                        },
                        {
                            da: 3,
                            db: []
                        }
                    ],
                    b: [
                        {
                            da: 5,
                            db: ['foo']
                        }
                    ]
                }
            },
            contract: {
                a: {
                    type: 'embedded',
                    embed: {
                        aa: {
                            type: 'number'
                        },
                        ab: {
                            type: 'string_array'
                        }
                    }
                },
                b: {
                    type: 'embedded_array',
                    embed: {
                        ba: {
                            type: 'number'
                        },
                        bb: {
                            type: 'string_array'
                        }
                    }
                },
                c: {
                    type: 'embedded_object',
                    embed: {
                        ca: {
                            type: 'number'
                        },
                        cb: {
                            type: 'string_array'
                        }
                    }
                },
                d: {
                    type: 'embedded_array_object',
                    embed: {
                        da: {
                            type: 'number'
                        },
                        db: {
                            type: 'string_array'
                        }
                    }
                }
            },
            expected: {
                a: {
                    aa: 1,
                    ab: []
                },
                b: [
                    {
                        ba: 2,
                        bb: ['foo']
                    },
                    {
                        ba: 3,
                        bb: ['bar']
                    }
                ],
                c: {
                    a: {
                        ca: 4,
                        cb: ['foo', 'bar']
                    },
                    b: {
                        ca: 5,
                        cb: ['foo']
                    }
                },
                d: {
                    a: [
                        {
                            da: 4,
                            db: ['foo', 'bar']
                        },
                        {
                            da: 3,
                            db: []
                        }
                    ],
                    b: [
                        {
                            da: 5,
                            db: ['foo']
                        }
                    ]
                }
            }
        },
        {
            data: {
                foo: 1
            },
            contract: {
                foo: {
                    type: 'number',
                    required: true
                },
                bar: {
                    type: 'number',
                    default: 4
                }
            },
            expected: {
                foo: 1,
                bar: 4
            }
        },
        {
            data: {
            },
            contract: {
                foo: {
                    type: 'embedded',
                    default: {},
                    embed: {
                        bar: {
                            type: 'number',
                            default: 3
                        }
                    }
                }
            },
            expected: {
                foo: {bar: 3}
            }
        },
        {
            data: {
            },
            contract: {
                foo: {
                    type: 'embedded_array',
                    default: [],
                    embed: {
                        bar: {
                            type: 'number',
                            default: 3
                        }
                    }
                }
            },
            expected: {
                foo: []
            }
        },
        {
            data: {
                foo: 2
            },
            contract: {
                foo: {
                    type: 'number',
                    validate: function(value) {
                        if (value !== 2) {
                            throw new Error('must be 2')
                        }
                    }
                }
            },
            expected: {
                foo: 2
            }
        },
        {
            data: {
                foo: 3
            },
            contract: {
                foo: {
                    type: 'number'
                },
                bar: {
                    type: 'embedded',
                    embed: {
                        a: {
                            type: 'number',
                            required: true
                        },
                        b: {
                            type: 'string'
                        }
                    }
                }
            },
            expected: {
                foo: 3
            }
        },
        {
            data: {
                foo: '3'
            },
            contract: {
                foo: {
                    type: 'number'
                }
            },
            expected: {
                foo: 3
            }
        },
        {
            data: {
                foo: '1'
            },
            contract: {
                foo: {
                    type: 'boolean'
                }
            },
            expected: {
                foo: true
            }
        },
        {
            data: {
                foo: 1
            },
            contract: {
                foo: {
                    type: 'boolean'
                }
            },
            expected: {
                foo: true
            }
        },
        {
            data: {
                foo: [1, 3, 5]
            },
            contract: {
                foo: {
                    format: function(value) {
                        if (Array.isArray(value)) {
                            var formattedValue = 0;

                            for (var i = 0; i < value.length; i++) {
                                formattedValue += value[i];
                            }

                            return formattedValue;
                        }
                    },
                    type: 'number'
                }
            },
            expected: {
                foo: 9
            }
        },
        {
            data: {
                foo: [1, 3, 5]
            },
            contract: {
                foo: {
                    format: function(value) {
                        if (Array.isArray(value)) {
                            var formattedValue = 0;

                            for (var i = 0; i < value.length; i++) {
                                formattedValue += value[i];
                            }

                            return formattedValue;
                        }
                    },
                    type: 'number',
                    validate: function(value) {
                        if (value !== 9) {
                            throw new Error('must be 9')
                        }
                    }
                }
            },
            expected: {
                foo: 9
            }
        },
        {
            data: {
                foo: 9
            },
            contract: {
                foo: {
                    type: 'number',
                    validate: function(value) {
                        return Math.min(value, 5);
                    }
                }
            },
            expected: {
                foo: 5
            }
        }
    ]
;

var resolveErrorTests = [
        {
            data: {foo: 1},
            expected: /The contract must be an object./
        },
        {
            data: {foo: 1},
            contract: {},
            expected: /The embedded field "foo" is not defined in the contract of the field ""./
        },
        {
            data: {foo: 1},
            contract: {foo: {type: 'number'}, bar: {type: 'number', required: true}},
            expected: / The value is required for the field "0.bar"./,
            namespace: '0'
        },
        {
            data: {foo: 1},
            contract: {foo: {}},
            expected: /There is no type parameter defined for the contract of the field "1.foo"./,
            namespace: '1'
        },
        {
            data: {foo: 1},
            contract: {foo: {type: 'string'}},
            expected: /The expected value for "3.foo" is a "string"; a "number" of value `1` given instead./,
            namespace: '3'
        },
        {
            data: {foo: 'bar'},
            contract: {foo: {type: 'number'}},
            expected: /The expected value for "4.foo" is a "number"; a "string" of value `"bar"` given instead./,
            namespace: '4'
        },
        {
            data: {foo: 'bar'},
            contract: {foo: {type: 'boolean'}},
            expected: /The expected value for "5.foo" is a "boolean"; a "string" of value `"bar"` given instead./,
            namespace: '5'
        },
        {
            data: {foo: 1},
            contract: {foo: {type: 'function'}},
            expected: /The expected value for "6.foo" is a "function"; a "number" of value `1` given instead./,
            namespace: '6'
        },
        {
            data: {foo: 1},
            contract: {foo: {type: 'string_array'}},
            expected: /The expected value for "7.foo" is a "string_array"; a "number" of value `1` given instead./,
            namespace: '7'
        },
        {
            data: {foo: ['foo', 'bar']},
            contract: {foo: {type: 'number_array'}},
            expected: /The expected value for "8.foo" is a "number_array"; a "string_array" of value `\["foo","bar"\]` given instead./,
            namespace: '8'
        },
        {
            data: {foo: 1},
            contract: {foo: {type: 'string_object'}},
            expected: /The expected value for "9.foo" is a "string_object"; a "number" of value `1` given instead./,
            namespace: '9'
        },
        {
            data: {foo: {bar: 'bar'}},
            contract: {foo: {type: 'boolean_object'}},
            expected: /The expected value for "10.foo" is a "boolean_object"; a "string_object" of value `{"bar":"bar"}` given instead./,
            namespace: '10'
        },
        {
            data: {foo: 1},
            contract: {foo: {type: 'mixed_object'}},
            expected: /The expected value for "11.foo" is a "mixed_object"; a "number" of value `1` given instead./,
            namespace: '11'
        },
        {
            data: {foo: {bar: 1}},
            contract: {foo: {type: 'number_array_object'}},
            expected: /The expected value for "12.foo" is a "number_array_object"; a "number_object" of value `{"bar":1}` given instead./,
            namespace: '12'
        },
        {
            data: {foo: {bar: [1]}},
            contract: {foo: {type: 'string_array_object'}},
            expected: /The expected value for "13.foo" is a "string_array_object"; a "number_array_object" of value `{"bar":\[1\]}` given instead./,
            namespace: '13'
        },
        {
            data: {foo: 1},
            contract: {foo: {type: 'mixed_array_object'}},
            expected: /The expected value for "14.foo" is a "mixed_array_object"; a "number" of value `1` given instead./,
            namespace: '14'
        },
        {
            data: {foo: true},
            contract: {foo: {type: 'number|string'}},
            expected: /The expected value for "15.foo" is a "number" or a "string"; a "boolean" of value `true` given instead./,
            namespace: '15'
        },
        {
            data: {foo: {}},
            contract: {foo: {type: 'embedded', embed: {bar: {type: 'number', required: true}}}},
            expected: /The value is required for the field "16.foo.bar"./,
            namespace: '16'
        },
        {
            data: {foo: [{bar: 2}, {bar: 'foo'}]},
            contract: {foo: {type: 'embedded_array', embed: {bar: {type: 'number'}}}},
            expected: /The expected value for "17.foo\[1\].bar" is a "number"; a "string" of value `"foo"` given instead./,
            namespace: '17'
        },
        {
            data: {foo: {a: {bar: 2}, b: {foo: 3}}},
            contract: {foo: {type: 'embedded_object', embed: {bar: {type: 'number', required: true}}}},
            expected: /The embedded field "foo" is not defined in the contract of the field "18.foo.b"./,
            namespace: '18'
        },
        {
            data: {foo: {a: [{bar: 2}], b: [3]}},
            contract: {foo: {type: 'embedded_array_object', embed: {bar: {type: 'number', required: true}}}},
            expected: /The expected value for "19.foo" is an "object of arrays of object properties"; a "number" of value `3` was found in the array `\[3\]` of the object `{"a":\[{"bar":2}\],"b":\[3\]}`./,
            namespace: '19'
        },
        {
            data: {foo: 2},
            contract: {foo: {
                type: 'number',
                validate: function(value) {
                    if (1 < value) {
                        throw new Error('an "integer lower than or equal to 1"');
                    }
                }
            }},
            expected: /The expected value for "20.foo" is an "integer lower than or equal to 1"; a "number" of value `2` given instead./,
            namespace: '20'
        },
        {
            data: {foo: [1, 3, 5]},
            contract: {foo: {
                format: function(value) {
                    if (Array.isArray(value)) {
                        var formattedValue = 0;

                        for (var i = 0; i < value.length; i++) {
                            formattedValue += value[i];
                        }

                        return formattedValue;
                    }
                },
                type: 'number',
                validate: function(value) {
                    if (value !== 8) {
                        throw new Error('8')
                    }
                }
            }},
            expected: /The expected value for "21.foo" is 8; a "number" of value `9` given instead./,
            namespace: '21'
        },
        {
            data: {foo: [1, 'a', 5]},
            contract: {foo: {
                format: function(value) {
                    if (Array.isArray(value)) {
                        var formattedValue = 0;

                        for (var i = 0; i < value.length; i++) {
                            formattedValue += value[i];
                        }

                        return formattedValue;
                    }
                },
                type: 'number'
            }},
            expected: /The expected value for "22.foo" is a "number"; a "string" of value `"1a5"` given instead./,
            namespace: '22'
        }
    ]
;

var mergeTests = [
        {
            data1: {
                foo: 1
            },
            data2: {
                bar: '2'
            },
            contract: {
                foo: {
                    type: 'number'
                },
                bar: {
                    type: 'string'
                }
            },
            expected: {
                foo: 1,
                bar: '2'
            }
        },
        {
            data1: {
                foo: ['foo']
            },
            data2: {
                foo: ['bar']
            },
            contract: {
                foo: {
                    type: 'string_array'
                }
            },
            erase: true,
            expected: {
                foo: ['bar']
            }
        },
        {
            data1: {
                foo: {
                    a: {bar: 1},
                    b: {bar: 2},
                    c: {bar: 3}
                }
            },
            data2: {
                foo: {
                    d: {bar: 4},
                    e: {bar: 5}
                }
            },
            contract: {
                foo: {
                    type: 'embedded_object',
                    embed: {
                        bar: {
                            type: 'number'
                        }
                    }
                }
            },
            expected: {
                foo: {
                    a: {bar: 1},
                    b: {bar: 2},
                    c: {bar: 3},
                    d: {bar: 4},
                    e: {bar: 5}
                }
            }
        },
        {
            data1: {
                foo: [
                    {bar: 1},
                    {bar: 2}
                ]
            },
            data2: {
                foo: [
                    {bar: 3}
                ]
            },
            contract: {
                foo: {
                    type: 'embedded_array',
                    embed: {
                        bar: {
                            type: 'number'
                        }
                    }
                }
            },
            erase: true,
            expected: {
                foo: [
                    {bar: 3}
                ]
            }
        },
        {
            data1: {
                foo: {a: 1, b: 2}
            },
            data2: {
                foo: {c: 3}
            },
            contract: {
                foo: {
                    type: 'number_object',
                }
            },
            expected: {
                foo: {a: 1, b: 2, c: 3}
            }
        },
        {
            data1: {
                foo: {
                    a: {bar: {x: 1}},
                    b: {bar: {z: 3}}
                }
            },
            data2: {
                foo: {
                    a: {bar: {y: 2}}
                }
            },
            contract: {
                foo: {
                    type: 'embedded_object',
                    embed: {
                        bar: {
                            type: 'number_object'
                        }
                    }
                }
            },
            erase: true,
            expected: {
                foo: {
                    a: {bar: {x: 1, y: 2}},
                    b: {bar: {z: 3}}
                }
            }
        },
        {
            data1: {
                foo: 3
            },
            data2: {
            },
            contract: {
                foo: {
                    type: 'number'
                },
                bar: {
                    type: 'embedded',
                    embed: {
                        a: {
                            type: 'number',
                            required: true
                        },
                        b: {
                            type: 'string'
                        }
                    }
                }
            },
            expected: {
                foo: 3
            }
        },
        {
            data1: {
                foo: {
                    a: [
                        {bar: 1},
                        {bar: 2}
                    ],
                    b: [
                        {bar: 3}
                    ]
                }
            },
            data2: {
                foo: {
                    b: [
                        {bar: 4}
                    ],
                    c: [
                        {bar: 5}
                    ]
                }
            },
            contract: {
                foo: {
                    type: 'embedded_array_object',
                    embed: {
                        bar: {
                            type: 'number'
                        }
                    }
                }
            },
            erase: true,
            expected: {
                foo: {
                    a: [
                        {bar: 1},
                        {bar: 2}
                    ],
                    b: [
                        {bar: 4}
                    ],
                    c: [
                        {bar: 5}
                    ]
                }
            }
        },
    ]
;

var mergeErrorTests = [
        {
            data1: {
                foo: 1
            },
            data2: {
                foo: 2,
                bar: '2'
            },
            contract: {
                foo: {
                    type: 'number'
                },
                bar: {
                    type: 'string'
                }
            },
            expected: /You cannot merge the value "1" with the value "2" for the field "foo"./
        },
        {
            data1: {
                foo: {a: 1, b: 2}
            },
            data2: {
                foo: {a: 3}
            },
            contract: {
                foo: {
                    type: 'number_object',
                }
            },
            expected: /You cannot merge the value "{"a":1,"b":2}" with the value "{"a":3}" for the field "foo"./
        }
    ]
;

describe('DataResolver', function() {
    resolveTests.forEach(function(test) {
        it('method "resolve" should resolve data from a contract', function() {
            var result = dataResolver.resolve(
                    test.data,
                    test.contract,
                    test.namespace,
                    test.forcesAny
                )
            ;

            assert.deepEqual(result, test.expected);
        })
    })

    resolveErrorTests.forEach(function(test) {
        it('method "resolve" should fail if the data does not respect the contract', function() {
            assert.throws(
                function() {
                    dataResolver.resolve(
                        test.data,
                        test.contract,
                        test.namespace,
                        test.forcesAny
                    );
                },
                test.expected
            );
        })
    });

    mergeTests.forEach(function(test) {
        it('method "merge" should merge two data from a contract', function() {
            var result = dataResolver.merge(
                    test.data1,
                    test.data2,
                    test.contract,
                    test.erase,
                    test.namespace
                )
            ;

            assert.deepEqual(result, test.expected);
        })
    });

    mergeErrorTests.forEach(function(test) {
        it('method "merge" should fail if the two data cannot be merged', function() {
            assert.throws(
                function() {
                    dataResolver.merge(
                        test.data1,
                        test.data2,
                        test.contract,
                        test.erase,
                        test.namespace
                    );
                },
                test.expected
            );
        })
    });
})