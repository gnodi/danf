'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    TestHelper = require('../../../lib/server/test/test-helper')
;

var configuration = {
        config: {
            classes: {
                a: require('../../fixture/app/a'),
                b: require('../../fixture/app/b'),
                c: require('../../fixture/app/c')
            },
            services: {
                a: {
                    class: require('../../fixture/app/a')
                }
            },
            sequences: {
                s: {
                    operations: [
                        {
                            service: 'a',
                            method: 'a',
                            scope: 'a'
                        },
                        {
                            service: 'a',
                            method: 'a',
                            scope: 'b'
                        }
                    ]
                }
            }
        }
    },
    context = {
        verbosity: 0,
        check: 1
    }
;

TestHelper.use(configuration, context, function(testHelper) {
    describe('TestHelper', function() {
        it('method "getClass" should be able to retrieve a defined and processed (inheritance, ...) class', function() {
            var C = testHelper.getClass('c'),
                c = new C()
            ;

            assert.equal(4, c.c());
        })

        it('method "getInstance" should be able to retrieve a defined and processed (inheritance, ...) class and instantiate a new object', function() {
            var b = testHelper.getInstance('b');

            assert.equal(3, b.b());
        })

        it('method "getService" should be able to retrieve a defined service', function() {
            var a = testHelper.getService('a');

            assert.equal(2, a.a());
        })

        it('method "getSequence" should be able to retrieve a defined sequence', function(done) {
            var s = testHelper.getSequence('s');

            s.execute({}, {}, '.', null, function(output) {
                assert.deepEqual(
                    output,
                    {
                        a: 3,
                        b: 4
                    }
                );

                done();
            });
        })

        it('method "getApp" should be able to retrieve the built app', function() {
            var app = testHelper.getApp();

            assert.equal(1, app.context.check);
        })

        describe('method "testAsync"', function() {
            it('should allow to test an asynchronous process', function(done) {
                var expected = 2;

                testHelper.testAsync(
                    function(async) {
                        setTimeout(
                            async(function() {
                                return expected;
                            }),
                            10
                        );
                    },
                    function(error, result) {
                        assert.equal(result, expected);

                        done();
                    }
                );
            })

            it('should allow to test an errored path in an asynchronous process', function(done) {
                testHelper.testAsync(
                    function(async) {
                        setTimeout(
                            async(function() {
                                throw new Error('foo');
                            }),
                            10
                        );
                    },
                    function(error, result) {
                        try {
                            assert.throws(
                                function() {
                                    if (error) {
                                        throw error;
                                    }
                                },
                                /^foo$/
                            );
                        } catch (err) {
                        }

                        done();
                    }
                );
            })

            it('should allow to catch the error of an errored path in an asynchronous process and set a result', function(done) {
                var expected = 'foo';

                testHelper.testAsync(
                    function(async) {
                        setTimeout(
                            async(function() {
                                throw new Error(expected);
                            }),
                            10
                        );
                    },
                    function(error, result) {
                        assert.equal(result, expected);

                        done();
                    },
                    function(error) {
                        return error.message;
                    }
                );
            })

            it('should allow to catch the error of an errored path in an asynchronous process to forward another one', function(done) {
                testHelper.testAsync(
                    function(async) {
                        setTimeout(
                            async(function() {
                                throw new Error('foo');
                            }),
                            10
                        );
                    },
                    function(error, result) {
                        assert.equal(error.message, 'foobar');

                        done();
                    },
                    function(error) {
                        var err = new Error(error.message);

                        err.message += 'bar';

                        throw err;
                    }
                );
            })
        })

        describe('function "use"', function() {
            it('should retrieve the same test helper instance for the same arguments', function(done) {
                testHelper.foo = 'bar';

                TestHelper.use(configuration, context, function(otherTestHelper) {
                    assert.equal(otherTestHelper.foo, 'bar');
                    done();
                });
            })

            it('should retrieve a different test helper instance for different arguments', function(done) {
                testHelper.foo = 'bar';

                TestHelper.use(configuration, {check: 2, verbosity: 0}, function(otherTestHelper) {
                    assert.notEqual(otherTestHelper.foo, 'bar');
                    done();
                });
            })
        })
    })

    run();
});