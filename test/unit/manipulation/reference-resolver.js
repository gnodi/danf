'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ReferenceResolver = require('../../../lib/common/manipulation/reference-resolver'),
    ReferenceType = require('../../../lib/common/manipulation/reference-type')
;

var referenceResolver = new ReferenceResolver(),
    referenceType = new ReferenceType(),
    sizeReferenceType = new ReferenceType(),
    noConcatenationReferenceType = new ReferenceType()
;

referenceType.name = 'test';
referenceType.delimiter = '%';

sizeReferenceType.name = 'size';
sizeReferenceType.delimiter = '%';
sizeReferenceType.size = 3;
sizeReferenceType.allowsConcatenation = false;

noConcatenationReferenceType.name = 'noConcatenation';
noConcatenationReferenceType.delimiter = '@';
noConcatenationReferenceType.allowsConcatenation = false;

referenceResolver.addReferenceType(referenceType);
referenceResolver.addReferenceType(sizeReferenceType);
referenceResolver.addReferenceType(noConcatenationReferenceType);

var tests = [
        {
            source: '%foo.bar%',
            context: {foo: { bar: 'ok' }},
            expected: 'ok'
        },
        {
            source: 'I love %who%',
            context: {who: 'you'},
            expected: 'I love you'
        },
        {
            source: 'I love %who%',
            context: {who: ['you', 'me']},
            expected: ['I love you', 'I love me']
        },
        {
            source: 'I love %who%',
            context: {
                who: {
                    you: 'Johna Doe',
                    me: 'John Doe'
                }
            },
            expected: ['I love Johna Doe', 'I love John Doe']
        },
        {
            source: 'I love %who%',
            context: {
                who: {
                    you: {name: 'Johna Doe'},
                    me: {name: 'John Doe'}
                }
            },
            expected: ['I love you', 'I love me']
        },
        {
            source: '%who%',
            context: {
                who: {
                    you: 'Johna Doe',
                    me: 'John Doe'
                }
            },
            expected: {you: 'Johna Doe', me: 'John Doe'}
        },
        {
            source: '%who.man% loves %who.woman%',
            context: {
                who: [
                    {
                        man: 'Brad',
                        woman: 'Angelina'
                    },
                    {
                        man: 'Bobby',
                        woman: 'Bob'
                    }
                ]
            },
            expected: ['Brad loves Angelina', 'Bobby loves Bob']
        },
        {
            source: '%who.man% loves %who.woman%',
            context: {
                who: {
                    Smith: {
                        man: 'Brad',
                        woman: 'Angelina'
                    },
                    Booble: {
                        man: 'Bobby',
                        woman: 'Bob'
                    }
                }
            },
            expected: ['Brad loves Angelina', 'Bobby loves Bob']
        },
        {
            source: '%who.Smith.man% loves %who.Smith.woman%',
            context: {
                who: {
                    Smith: {
                        man: 'Brad',
                        woman: 'Angelina'
                    },
                    Booble: {
                        man: 'Bobby',
                        woman: 'Bob'
                    }
                }
            },
            expected: 'Brad loves Angelina'
        },
        {
            source: '%`who.man`% loves %`who.woman`%',
            context: {
                who: {
                    Smith: {
                        man: 'Brad',
                        woman: 'Angelina'
                    },
                    Booble: {
                        man: 'Bobby',
                        woman: 'Bob'
                    }
                }
            },
            expected: [
                'Brad loves Angelina',
                'Bobby loves Angelina',
                'Brad loves Bob',
                'Bobby loves Bob'
            ]
        },
        {
            source: '%`who.man`% loves %who.woman% who loves %who.man%',
            context: {
                who: {
                    Smith: {
                        man: 'Brad',
                        woman: 'Angelina'
                    },
                    Booble: {
                        man: 'Bobby',
                        woman: 'Bob'
                    }
                }
            },
            expected: [
                'Brad loves Angelina who loves Brad',
                'Brad loves Bob who loves Bobby',
                'Bobby loves Angelina who loves Brad',
                'Bobby loves Bob who loves Bobby'
            ]
        },
        {
            source: '%who.name.first% %who.name.last% is %who.age% and lives in %who.cities%',
            context: {
                who: {
                    name: {
                        first: 'John',
                        last: 'Doe'
                    },
                    age: 25,
                    cities: ['Paris', 'New York']
                }
            },
            expected: [
                'John Doe is 25 and lives in Paris',
                'John Doe is 25 and lives in New York'
            ]
        },
        {
            source: '%who.names% is %who.ages% and lives in %who.city%',
            context: {
                who: {
                    names: ['John', 'Bobby'],
                    ages: [20, 25],
                    city: 'Paris'
                }
            },
            expected: [
                'John is 20 and lives in Paris',
                'John is 25 and lives in Paris',
                'Bobby is 20 and lives in Paris',
                'Bobby is 25 and lives in Paris'
            ]
        },
        {
            source: '%who.name.first% %who.name.last% is %who.age% and lives in %who.cities%',
            context: {
                who: [
                    {
                        name: {
                            first: 'John',
                            last: 'Doe'
                        },
                        age: 25,
                        cities: ['Paris', 'New York']
                    },
                    {
                        name: {
                            first: 'Bobby',
                            last: 'Bob'
                        },
                        age: 28,
                        cities: ['Houston']
                    },
                ]
            },
            expected: [
                'John Doe is 25 and lives in Paris',
                'John Doe is 25 and lives in New York',
                'Bobby Bob is 28 and lives in Houston'
            ]
        },
        {
            source: '%main.a% is %main.d.f% in %main.b% for %main.d.e%',
            context: {
                main: [
                    {
                        a: '?',
                        b: ['plop', 'plip'],
                        c: ['plap'],
                        d: [
                            {
                                e: 'me',
                                f: ['here', 'now']
                            },
                            {
                                e: 'you',
                                f: ['home']
                            }
                        ]
                    },
                    {
                        a: '!',
                        b: ['plup'],
                        c: [],
                        d: [
                            {
                                e: 'anybody',
                                f: ['nowhere']
                            }
                        ]
                    }
                ]
            },
            expected: [
                '? is here in plop for me',
                '? is here in plip for me',
                '? is now in plop for me',
                '? is now in plip for me',
                '? is home in plop for you',
                '? is home in plip for you',
                '! is nowhere in plup for anybody'
            ]
        },
        {
            source: '%foo.bar',
            context: {foo: { bar: 'ok' }},
            expected: '%foo.bar'
        },
        {
            source: '%foo.bar %bar.foo',
            context: {foo: { bar: 'ok' }},
            expected: '%foo.bar %bar.foo'
        },
        {
            source: '%foo.bar% %bar.foo',
            context: {foo: { bar: 'ok' }},
            expected: 'ok %bar.foo'
        },
        {
            source: '%bar.foo %foo.bar%',
            context: {foo: { bar: 'ok' }},
            expected: '%bar.foo ok'
        },
        {
            source: '%foo.bar% %bar.foo %foo.bar%',
            context: {foo: { bar: 'ok' }},
            expected: 'ok %bar.foo ok'
        },
        {
            source: '%foo.bar% %foo.bar%foo.bar%',
            context: {foo: { bar: 'ok' }},
            expected: 'ok okfoo.bar%'
        },
        {
            source: '%foo.bar% % foo.bar%foo.bar%',
            context: {foo: { bar: 'ok' }},
            expected: 'ok % foo.barok'
        },
        {
            source: '>rule.%rules%>provider>%%rules.%rules%%%>',
            context: {rules: {minSize: {}, maxSize: {}}},
            expected: [
                '>rule.minSize>provider>%rules.minSize%>',
                '>rule.maxSize>provider>%rules.maxSize%>'
            ]
        },
        {
            source: '%.%',
            context: {foo: { bar: 'ok' }},
            expected: {foo: { bar: 'ok' }}
        },
        {
            source: '%a\\%\\b%',
            context: {'a\\%\\b': 2},
            expected: 2
        },
        {
            source: '%foo.bar%',
            context: {foo: {bar: null}}
        }
    ]
;

describe('ReferenceResolver', function() {
    describe('method "resolve"', function() {
        tests.forEach(function(test) {
            it('should resolve references', function() {
                var result = referenceResolver.resolve(test.source, 'test', test.context);

                assert.deepEqual(result, test.expected);
            })
        });

        it('should fail if the type has a size greater than 1', function() {
            assert.throws(
                function() {
                    referenceResolver.resolve('%foo.bar%', 'size');
                },
                /The references in source "%foo.bar%" cannot be resolved because the size of the type "size" is greater than 1./
            );
        })

        it('should fail to concatenate if the type does not allow concatenation', function() {
            assert.throws(
                function() {
                    referenceResolver.resolve('prefix@foo.bar@', 'noConcatenation');
                },
                /The references in source "prefix@foo.bar@" cannot be resolved because the type "noConcatenation" does not allow concatenation./
            );
        })

        it('should fail to resolve references if the type is not defined', function() {
            assert.throws(
                function() {
                    referenceResolver.resolve('%foo.bar%', 'dumb');
                },
                /The reference type "dumb" is not defined./
            );
        })
    })

    describe('method "extract"', function() {
        it('should extract references', function() {
            var result = referenceResolver.extract('@foo@', 'noConcatenation');

            assert.ok(result);
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 1);
            assert.equal(result[0], 'foo');

            result = referenceResolver.extract('%foo%bar%%', 'size');

            assert.ok(result);
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 3);
            assert.equal(result[0], 'foo');
            assert.equal(result[1], 'bar');
            assert.equal(result[2], '');
        })

        it('should complete extracted references with an size inferior to the type size', function() {
            var result = referenceResolver.extract('%foo%bar%', 'size');

            assert.ok(result);
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 3);
            assert.equal(result[0], 'foo');
            assert.equal(result[1], 'bar');
            assert.equal(result[2], '');
        })

        it('should return null if there is no reference to extract', function() {
            var result = referenceResolver.extract('foo', 'size');

            assert.equal(result, null);

            var result = referenceResolver.extract('%foo%bar', 'size');

            assert.equal(result, null);

            var result = referenceResolver.extract('%', 'noConcatenation');

            assert.equal(result, null);
        })

        it('should fail to extract a reference if the size of the reference is greater than the size defined by the type', function() {
            assert.throws(
                function() {
                    referenceResolver.extract('%foo%bar%foo%bar%', 'size');
                },
                /The reference of the source "%foo%bar%foo%bar%" cannot be extracted because the type "size" define a size of "3" which is inferior to the size of the found reference \(4\)./
            );
        })

        it('should fail to extract a reference if the type is not defined', function() {
            assert.throws(
                function() {
                    referenceResolver.resolve('%foo%', 'dumb');
                },
                /The reference type "dumb" is not defined./
            );
        })
    })
})