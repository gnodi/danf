'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    TestHelper = require('../../../lib/server/test/test-helper')
;

var testHelper = TestHelper.get(
        {
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
                }
            }
        },
        {check: 1}
    )
;

describe('TestHelper', function() {
    it('method "getService" should be able to retrieve a defined service', function() {
        var a = testHelper.getService('a');

        assert.equal(2, a.a());
    })

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

    it('method "getApp" should be able to retrieve the built app', function() {
        var app = testHelper.getApp();

        assert.equal(1, app.context.check);
    })

    describe('function "get"', function() {
        it('should retrieve the same test helper instance for the same arguments', function() {
            testHelper.foo = 'bar';

            var otherTestHelper = TestHelper.get(
                    {
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
                            }
                        }
                    },
                    {check: 1}
                )
            ;

            assert.equal(otherTestHelper.foo, 'bar');
        })

        it('should retrieve a different test helper instance for different arguments', function() {
            var otherTestHelper = TestHelper.get(
                    {
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
                            }
                        }
                    },
                    {check: 2}
                )
            ;

            assert.notEqual(otherTestHelper.foo, 'bar');
        })
    })
})