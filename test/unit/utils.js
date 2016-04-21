'use strict';

require('../../lib/common/init');

var assert = require('assert'),
    utils = require('../../lib/common/utils')
;

var mergeTests = [
        {
            arguments: [
                {a: 1},
                {b: 2}
            ],
            expected: {
                a: 1,
                b: 2
            }
        },
        {
            arguments: [
                {a: 1, b: {c: 3}},
                {b: {d: 4}}
            ],
            expected: {
                a: 1,
                b: {d: 4}
            }
        },
        {
            arguments: [
                {a: 1, b: {c: 3}},
                {b: {d: 4}},
                true
            ],
            expected: {
                a: 1,
                b: {c: 3, d: 4}
            }
        },
        {
            arguments: [
                {a: 1, b: {c: 3}},
                {b: {d: 4}},
                {b: {e: 5}},
                true
            ],
            expected: {
                a: 1,
                b: {c: 3, d: 4, e: 5}
            }
        },
        {
            arguments: [
                {a: {b: {c: 3}}},
                {a: {b: {d: 4}}},
                1
            ],
            expected: {
                a: {b: {d: 4}}
            }
        },
        {
            arguments: [
                {a: {b: {c: 3}}},
                {a: {b: {d: 4}}},
                true
            ],
            expected: {
                a: {b: {c: 3, d: 4}}
            }
        },
        {
            arguments: [
                {a: {b: [3, 2]}},
                {a: {b: [2, 4]}},
                true
            ],
            expected: {
                a: {b: [3, 2, 2, 4]}
            }
        },
        {
            arguments: [
                {a: {b: [3, 2]}},
                {a: {c: 2}},
                true
            ],
            expected: {
                a: {b: [3, 2], c: 2}
            }
        },
        {
            arguments: [
                {a: {b: [3, 2]}},
                {a: {b: {c: 2, d: 4}}},
                true
            ],
            expected: {
                a: {b: {0: 3, 1: 2, c: 2, d: 4}}
            }
        }
    ]
;

var circularObject = {};
circularObject.a = circularObject;

var stringifyTests = [
        {
            object: {
                a: {
                    a: {
                        a: 2,
                        b: 3
                    },
                    b: 4,
                },
                foo: 'bar'
            },
            length: 100,
            expected: '{"a":{"a":{"a":2,"b":3},"b":4},"foo":"bar"}'
        },
        {
            object: {
                a: {
                    a: {
                        a: 2,
                        b: 3
                    },
                    b: 4,
                },
                foo: 'bar'
            },
            length: 10,
            expected: '{"a":{"a":...'
        },
        {
            object: circularObject,
            length: 100,
            expected: '...'
        },
        {
            object: {
                a: {
                    a: {
                        a: 2,
                        b: 3
                    },
                    b: 4,
                },
                foo: 'bar'
            },
            expected: '{"a":{"a":{"a":2,"b":3},"b":4},"foo":"bar"}'
        },
        {
            object: {
                a: {
                    a: {
                        a: 2,
                        b: 3
                    },
                    b: 4,
                },
                foo: 'bar'
            },
            length: 0,
            expected: '{"a":{"a":{"a":2,"b":3},"b":4},"foo":"bar"}'
        }
    ]
;

describe('utils', function() {
    mergeTests.forEach(function(test) {
        it('"merge" should merge objects', function() {
            var result = utils.merge.apply(this, test.arguments);

            assert.deepEqual(result, test.expected);
        })
    });

    it('"clone" should clone an object and its embedded objects', function() {
        var object = {
                a: 1,
                b: 2,
                c: {
                    d: 3,
                    e: 4
                }
            },
            clone = utils.clone(object),
            expected = {
                a: 1,
                b: 7,
                c: {
                    d: 8,
                    e: 4
                }
            }
        ;

        object.a = 5;
        object.c.e = 6;
        clone.b = 7;
        clone.c.d = 8;
        object.a = 9;

        assert.deepEqual(clone, expected);
    })

    it('"extends" should extend a function with another function (classes inheritance)', function() {
        var Extender = function() {
            this.b = 2;

            Extended.call(this);
        }

        Extender.prototype.inc = function() {
            this.a++;
        };

        var Extended = function() {
            this.a = 1;
        };

        Extended.prototype.dec = function() {
            this.a--;
        };

        utils.extend(Extended, Extender);

        var object = new Extender();

        assert(object.inc);
        assert(object.dec);
        assert.equal(object.a, 1);
        assert.equal(object.b, 2);
        object.inc();
        assert.equal(object.a, 2);
        object.dec();
        assert.equal(object.a, 1);
    })

    it('"flatten" should flatten an object', function() {
        var flattenObject = utils.flatten({
                a: {
                    a: {
                        a: 2,
                        b: 3
                    },
                    b: 4,
                },
                foo: 'bar'
            }),
            expected = {
                'a.a.a': 2,
                'a.a.b': 3,
                'a.b': 4,
                foo: 'bar'
            }
        ;

        assert.deepEqual(flattenObject, expected);
    })

    it('"clean" should return a cloned object cleaned of its operating properties', function() {
        var object = {
                a: {
                    a: {
                        __a: 2,
                        b: 3
                    },
                    __b: 4,
                },
                __foo: 'bar'
            },
            cleanedObject = utils.clean(object),
            expected = {
                a: {
                    a: {
                        b: 3
                    },
                }
            }
        ;

        assert.deepEqual(expected, cleanedObject);

        assert.equal(cleanedObject.b, undefined);
        assert.equal(object.b, undefined);
        cleanedObject.b = 2;
        assert.equal(cleanedObject.b, 2);
        assert.equal(object.b, undefined);

        cleanedObject = utils.clean(object, false);
        assert.equal(cleanedObject.c, undefined);
        assert.equal(object.c, undefined);
        cleanedObject.c = 3;
        assert.equal(cleanedObject.c, 3);
        assert.equal(object.c, 3);
    })

    stringifyTests.forEach(function(test) {
        it('"stringify" should stringify an object', function() {
            var result = utils.stringify(test.object, test.length);

            assert.deepEqual(result, test.expected);
        })
    });
})