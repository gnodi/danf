'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Route = require('../../../lib/common/http/route')
;

var route = new Route(),
    paramRoute = new Route(),
    regexpRoute = new Route(),
    hostRoute = new Route(),
    querystringRoute = new Route(),
    routes = [route, paramRoute, regexpRoute, hostRoute, querystringRoute],
    event = {
        trigger: function(data) {
            data.parameters.done();
        }
    },
    paramEvent = {
        trigger: function(data) {
            data.parameters.done();

            assert.equal(data.parameters.bar, 6);
            assert.equal(data.path, '/bar?foo=6');
            assert.equal(data.headers.x, 'foo');
        }
    }
;

route.path = 'foo';
route.method = 'get';
route.host = 'localhost';
route.event = event;

paramRoute.path = '/foo/:foo/bar/:bar';
paramRoute.method = 'POST';
paramRoute.host = 'localhost';
paramRoute.event = event;

regexpRoute.path = /^\/foo/;
regexpRoute.method = 'GET';
regexpRoute.host = 'localhost';
regexpRoute.event = event;

hostRoute.path = '/bar';
hostRoute.method = 'GET';
hostRoute.host = 'www.foo.bar';
hostRoute.event = event;

querystringRoute.path = '/bar?foo=:bar';
querystringRoute.method = 'GET';
querystringRoute.host = 'localhost';
querystringRoute.event = paramEvent;

var matchTests = [
        {
            path: 'foo',
            method: 'GET',
            expected: [true, false, true, false, false]
        },
        {
            path: '/foo',
            method: 'post',
            expected: [false, false, false, false, false]
        },
        {
            path: '/foo/bar',
            method: 'post',
            expected: [false, false, false, false, false]
        },
        {
            path: '/foo/1/bar/abc',
            method: 'POST',
            expected: [false, true, false, false, false]
        },
        {
            path: '/foobar',
            method: 'GET',
            expected: [false, false, true, false, false]
        },
        {
            path: '/foobar',
            method: 'GET',
            expected: [false, false, true, false, false]
        },
        {
            path: '/foobar',
            method: 'GET',
            expected: [false, false, true, false, false]
        },
        {
            path: '/foobar',
            method: 'GET',
            expected: [false, false, true, false, false]
        },
        {
            path: '/bar',
            method: 'GET',
            expected: [false, false, false, false, false]
        },
        {
            path: '/bar?foo=2',
            method: 'GET',
            host: 'www.foo.bar',
            expected: [false, false, false, true, false]
        },
        {
            path: '/bar?foo=2',
            method: 'GET',
            expected: [false, false, false, false, true]
        }
    ]
;

describe('Route', function() {
    describe('method "match"', function() {
        routes.forEach(function(route, i) {
            matchTests.forEach(function(test) {
                it('should match a path in a correct way', function() {
                    assert.equal(
                        route.match(test.path, test.method, test.host),
                        test.expected[i]
                    );
                })
            })
        })
    })

    describe('method "resolve"', function() {
        it('should resolve a route and parameters in a URL', function() {
            assert.equal(
                paramRoute.resolve({foo: 3, bar: 'xyz'}),
                '/foo/3/bar/xyz'
            );

            assert.equal(
                querystringRoute.resolve({bar: 4}),
                '/bar?foo=4'
            );
        })

        it('should fail to resolve a route with missing parameters', function() {
            assert.throws(
                function() {
                    paramRoute.resolve({foo: 5});
                },
                /Route \[POST\]"\/foo\/:foo\/bar\/:bar" needs a parameter "bar"\./
            );
        })

        it('should fail to resolve a route with a regexp path', function() {
            assert.throws(
                function() {
                    regexpRoute.resolve({});
                },
                /Cannot resolve route \[GET\]"\/\^\\\/foo\/" defined by a regular expression\./
            );
        })
    })

    describe('method "follow"', function() {
        it('should follow a route triggering its request event', function(done) {
            route.follow({done: done});
        })

        it('should resolve and follow a route with given parameters and headers', function(done) {
            querystringRoute.follow({bar: 6, done: done}, {x: 'foo'});
        })

        it('should resolve and follow a route from metadata', function(done) {
            paramRoute.follow({done: done}, null, {path: '/foo/7/bar/ijk'});
        })

        it('should fail to resolve and follow a route from incompatible metadata', function() {
            assert.throws(
                function() {
                    paramRoute.follow(null, null, {path: '/foo/ijk'});
                },
                /Path "\/foo\/ijk" for host "localhost" doest not match route \[POST\]"\/foo\/:foo\/bar\/:bar" of "localhost"\./
            );
        })

        it('should fail to resolve and follow a route from incompatible metadata', function() {
            assert.throws(
                function() {
                    hostRoute.follow(null, null, {path: '/bar', host: 'localhost'});
                },
                /Path "\/bar" for host "localhost" doest not match route \[GET\]"\/bar" of "www.foo.bar"\./
            );
        })
    })
})