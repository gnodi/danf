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
            assert.equal(data.id, id);
            data.done();
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
            route.event = properties.event;

            return route;
        }
    },
    configuredRoutes = {
        request: {
            a: {
                path: 'foo',
                methods: ['get']
            },
            b: {
                path: '/foo/:foo/bar/:bar',
                methods: ['get', 'POST']
            },
            c: {
                path: /^\/foo/,
                methods: ['post', 'GET']
            },
            d: {
                path: 'bar',
                methods: ['get']
            }
        }
    }
;

router.routeProvider = routeProvider;
router.eventsContainer = eventsContainer;

route.path = 'foo';
route.method = 'get';
route.event = new Event();

var findTests = [
        {
            path: 'foo',
            method: 'GET',
            expected: 'a'
        },
        {
            path: '/foo',
            method: 'post',
            expected: null
        },
        {
            path: '/foo/bar',
            method: 'post',
            expected: null
        },
        {
            path: 'http://domain.com/foo/1/bar/abc',
            method: 'POST',
            expected: 'b'
        },
        {
            path: 'https://www.domain.org/foobar',
            method: 'GET',
            expected: 'c'
        }
    ]
;

var findFailTests = [
        {
            path: '/foo',
            method: 'post',
            expected: /No route for \[POST\]"\/foo" found\./
        },
        {
            path: '/foo/bar',
            method: 'post',
            expected: /No route for \[POST\]"\/foo\/bar" found\./
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
            it('should find route from path/url and method', function(done) {
                var route = router.find(test.path, test.method);

                if (null === test.expected) {
                    assert.equal(route, null);
                    done();
                } else {
                    assert(route);
                    route.follow({id: test.expected, done: done});
                }
            })
        })

        findFailTests.forEach(function(test) {
            it('should throw an error on not found route if asked', function() {
                assert.throws(
                    function() {
                        router.find(test.path, test.method, true);
                    },
                    test.expected
                );
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
                    router.follow(test.path, test.method, {id: test.expected, done: done});
                })
            }
        })

        findFailTests.forEach(function(test) {
            it('should throw an error on not found route', function() {
                assert.throws(
                    function() {
                        router.follow(test.path, test.method);
                    },
                    test.expected
                );
            })
        })
    })
})