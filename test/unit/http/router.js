'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Route = require('../../../lib/common/http/route'),
    Router = require('../../../lib/common/http/router')
;

var route = new Route(),
    router = new Router(),
    Event = function(id) {
        this.trigger = function(data) {
            assert.equal(data.parameters.id, id);
            data.parameters.done();
        }
    },
    eventsContainer = {
        get: function (type, id) {
            return new Event(id);
        }
    },
    routeProvider = {
        provide: function(properties) {
            var route = new Route();

            route.path = properties.path;
            route.method = properties.method;
            route.host = properties.host;
            route.event = properties.event;

            return route;
        }
    },
    configuredRoutes = {
        request: {
            a: {
                path: 'foo',
                methods: ['get'],
                host: 'localhost'
            },
            b: {
                path: '/foo/:foo/bar/:bar',
                methods: ['get', 'POST'],
                host: 'localhost'
            },
            c: {
                path: /^\/foo/,
                methods: ['post', 'GET'],
                host: 'localhost'
            },
            d: {
                path: 'bar',
                methods: ['get'],
                host: 'localhost'
            },
            e: {
                path: '/foo/:foo/bar/:bar',
                methods: ['GET', 'POST'],
                host: 'domain.com'
            },
            f: {
                path: /^\/foo/,
                methods: ['GET'],
                host: 'www.domain.org'
            },
            g: {
                path: /^\/foo/,
                methods: ['GET'],
                host: 'www.domain.org:443'
            }
        }
    }
;

router.routeProvider = routeProvider;
router.eventsContainer = eventsContainer;

route.path = 'foo';
route.method = 'get';
route.host = 'localhost';
route.event = new Event();

var findTests = [
        {
            url: 'foo',
            method: 'GET',
            parsedUrl: {
                protocol: undefined,
                host: undefined,
                hostname: undefined,
                port: undefined,
                path: '/foo',
                pathname: '/foo',
                search: '',
                hash: '',
                parameters: {}
            },
            expected: 'a'
        },
        {
            url: '/foo',
            method: 'post',
            parsedUrl: {
                protocol: undefined,
                host: undefined,
                hostname: undefined,
                port: undefined,
                path: '/foo',
                pathname: '/foo',
                search: '',
                hash: '',
                parameters: {}
            },
            expected: null
        },
        {
            url: '/foo/bar',
            method: 'post',
            parsedUrl: {
                protocol: undefined,
                host: undefined,
                hostname: undefined,
                port: undefined,
                path: '/foo/bar',
                pathname: '/foo/bar',
                search: '',
                hash: '',
                parameters: {}
            },
            expected: null
        },
        {
            url: 'foo/1/bar/abc',
            method: 'POST',
            parsedUrl: {
                protocol: undefined,
                host: undefined,
                hostname: undefined,
                port: undefined,
                path: '/foo/1/bar/abc',
                pathname: '/foo/1/bar/abc',
                search: '',
                hash: '',
                parameters: {}
            },
            expected: 'b'
        },
        {
            url: 'http://domain.com/foo/1/bar/abc',
            method: 'POST',
            parsedUrl: {
                protocol: 'http:',
                host: 'domain.com',
                hostname: 'domain.com',
                port: undefined,
                path: '/foo/1/bar/abc',
                pathname: '/foo/1/bar/abc',
                search: '',
                hash: '',
                parameters: {}
            },
            expected: 'e'
        },
        {
            url: '/foobar?foo=bar',
            method: 'GET',
            parsedUrl: {
                protocol: undefined,
                host: undefined,
                hostname: undefined,
                port: undefined,
                path: '/foobar?foo=bar',
                pathname: '/foobar',
                search: '?foo=bar',
                hash: '',
                parameters: {foo: 'bar'}
            },
            expected: 'c'
        },
        {
            url: 'https://www.domain.org:443/foobar?foo=bar#plop',
            method: 'GET',
            parsedUrl: {
                protocol: 'https:',
                host: 'www.domain.org:443',
                hostname: 'www.domain.org',
                port: '443',
                path: '/foobar?foo=bar',
                pathname: '/foobar',
                search: '?foo=bar',
                hash: '#plop',
                parameters: {foo: 'bar'}
            },
            expected: 'g'
        }
    ]
;

var findFailTests = [
        {
            url: '/foo',
            method: 'post',
            expected: /No route \[POST\]"\/foo" found for host "localhost"\./
        },
        {
            url: '/foo/bar',
            method: 'post',
            expected: /No route \[POST\]"\/foo\/bar" found for host "localhost"\./
        }
    ]
;

describe('Router', function() {
    describe('method "set"', function() {
        it('should set a route', function() {
            router.set('foo', route);

            assert.deepEqual(router.get('foo'), route);
        })

        it('should replace an existing route', function() {
            var newRoute = new Route();

            newRoute.path = 'bar';
            newRoute.method = 'get';
            newRoute.host = 'localhost';
            newRoute.event = new Event();

            router.set('foo', newRoute);

            assert.notDeepEqual(router.get('foo'), route);
            assert.deepEqual(router.get('foo'), newRoute);
        })
    })

    describe('method "unset"', function() {
        it('should remove a route', function() {
            assert.throws(
                function() {
                    router.unset('foo', route);

                    router.get('foo');
                },
                /No route of name "foo" found\./
            );
        })
    })

    describe('method "handleRegistryChange"', function() {
        it('should set routes from configuration', function() {
            router.handleRegistryChange(
                configuredRoutes,
                false
            );

            assert(router.get('a'));
        })

        it('should remove routes from configuration', function() {
            assert.throws(
                function() {
                    router.handleRegistryChange(
                        {
                            request: {
                                d: {}
                            }
                        },
                        true
                    );

                    router.get('b');
                    router.get('d');
                },
                /No route of name "d" found\./
            );
        })
    })

    describe('method "find"', function() {
        router.handleRegistryChange(
            configuredRoutes,
            false
        );

        findTests.forEach(function(test) {
            it('should find route from path/url string and method', function(done) {
                var route = router.find(test.url, test.method);

                if (null === test.expected) {
                    assert.equal(route, null);
                } else {
                    assert(route);
                }

                done();
            })
        })

        findFailTests.forEach(function(test) {
            it('should throw an error on not found route if asked', function() {
                assert.throws(
                    function() {
                        router.find(test.url, test.method, true);
                    },
                    test.expected
                );
            })
        })
    })

    describe('method "parse" and "parseQuerystring" should parse url', function() {
        router.handleRegistryChange(
            configuredRoutes,
            false
        );

        findTests.forEach(function(test) {
            it('should find route from parsed path/url and method', function() {
                var parsedUrl = router.parse(test.url, test.method);

                assert.deepEqual(parsedUrl, test.parsedUrl);
            })
        })
    })

    describe('method "find"', function() {
        router.handleRegistryChange(
            configuredRoutes,
            false
        );

        findTests.forEach(function(test) {
            it('should find route from parsed path/url and method', function(done) {
                var route = router.find(test.parsedUrl, test.method);

                if (null === test.expected) {
                    assert.equal(route, null);
                } else {
                    assert(route);
                }

                done();
            })
        })
    })

    describe('method "follow"', function() {
        router.handleRegistryChange(
            configuredRoutes,
            false
        );

        findTests.forEach(function(test) {
            if (null !== test.expected) {
                it('should follow a route from an existing path/url and method', function(done) {
                    router.follow(test.url, test.method, {id: test.expected, done: function() { return done; }});
                })
            }
        })

        findFailTests.forEach(function(test) {
            it('should throw an error on not found route', function() {
                assert.throws(
                    function() {
                        router.follow(test.url, test.method);
                    },
                    test.expected
                );
            })
        })
    })
})