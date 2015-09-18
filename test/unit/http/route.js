'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Route = require('../../../lib/common/http/route')
;

var route = new Route(),
    paramRoute = new Route(),
    regexpRoute = new Route(),
    routes = [route, paramRoute, regexpRoute],
    event = {
        trigger: function(data) {
            data.done();
        }
    }
;

route.path = 'foo';
route.method = 'get';
route.event = event;

paramRoute.path = '/foo/:foo/bar/:bar';
paramRoute.method = 'POST';
paramRoute.event = event;


regexpRoute.path = /^\/foo/;
regexpRoute.method = 'GET';
regexpRoute.event = event;

var matchTests = [
        {
            path: 'foo',
            method: 'GET',
            expected: [true, false, true]
        },
        {
            path: '/foo',
            method: 'post',
            expected: [false, false, false]
        },
        {
            path: '/foo/bar',
            method: 'post',
            expected: [false, false, false]
        },
        {
            path: '/foo/1/bar/abc',
            method: 'POST',
            expected: [false, true, false]
        },
        {
            path: '/foobar',
            method: 'GET',
            expected: [false, false, true]
        }
    ]
;

describe('Route', function() {
    describe('method "match"', function() {
        routes.forEach(function(route, i) {
            matchTests.forEach(function(test) {
                it('should match a path in a correct way', function() {
                    assert.equal(
                        route.match(test.path, test.method),
                        test.expected[i]
                    );
                })
            })
        })
    })

    describe('method "follow"', function() {
        it('should follow a route triggering its request event', function(done) {
            route.follow({done: done});
        })
    })
})