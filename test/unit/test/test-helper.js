'use strict';

require('../../../lib/init');

var assert = require('assert'),
    TestHelper = require('../../../lib/server/test/test-helper')
;

var testHelper = TestHelper(
        {
            config: {
                classes: {
                    a: require('../../fixtures/app/a'),
                    b: require('../../fixtures/app/b'),
                    c: require('../../fixtures/app/c')
                },
                services: {
                    a: {
                        class: require('../../fixtures/app/a')
                    }
                }
            }
        },
        {check: 1}
    )
;

describe('EventsHandler', function() {
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
})