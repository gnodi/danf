'use strict';

var assert = require('assert'),
    request = require('supertest'),
    danf = require('../../lib/server/app')
;

var app = danf(require(__dirname + '/../fixture/danf'), '', {listen: false, environment: 'test', verbosity: 5});

describe('Danf application', function() {
    it('should provide a "container" accessible property', function() {
        assert(app.hasOwnProperty('servicesContainer'));
    })

    it('should instantiate a "services container"', function() {
        assert.notEqual(app.servicesContainer, undefined);
    })

    it('should add the danf services to the list of the container\'s services', function() {
        var dataResolver = app.servicesContainer.get('danf:manipulation.dataResolver');

        assert.notEqual(dataResolver, undefined);
    })

    it('should instanciate the services of the dependencies', function() {
        assert.equal(app.servicesContainer.get('main:dep2:storage.local').name, 'local storage');
        assert.equal(app.servicesContainer.get('main:dep2:provider.bigImages').rules[0].parameters[0].value, 3);
    })

    it('should interface the services with their defined existent interfaces', function() {
        var manager = app.servicesContainer.get('main:manager');

        assert(Object.isInstanceOf(manager, 'main:ManagerInterface'));
    })

    it('should resolve the defined parameters', function() {
        var parameter = app.servicesContainer.get('main:provider.bigImages.rules.0.parameters.0');

        assert.equal(parameter.name, 'parameter size');
    })

    it('should override a dependency of a submodule if defined in the configuration', function() {
        var counter1 = app.servicesContainer.get('main:dep1:module10:counter'),
            counter2 = app.servicesContainer.get('main:counter2'),
            counter3 = app.servicesContainer.get('main:dep3:module10:counter')
        ;

        assert.equal(counter1.count, 0);
        assert.equal(counter2.count, 0);
        assert.equal(counter3.count, 0);

        counter1.inc();

        assert.equal(counter1.count, 1);
        assert.equal(counter2.count, 1);
        assert.equal(counter3.count, 0);

        var manager1 = app.servicesContainer.get('main:dep1:manager'),
            manager2 = app.servicesContainer.get('main:dep2:manager'),
            manager3 = app.servicesContainer.get('main:dep3:manager')
        ;

        assert.equal(manager1.timeOut, 1000);
        assert.equal(manager2.timeOut, 1000);
        assert.equal(manager3.timeOut, 3000);

        assert.equal(manager1.try, 1);
        assert.equal(manager2.try, 1);
        assert.equal(manager3.try, 3);
    })

    it('should allow multilevel inheritance', function() {
        var classesContainer = app.servicesContainer.get('danf:object.classesContainer'),
            a = classesContainer.get('main:a'),
            b = classesContainer.get('main:b')
        ;

        assert.equal(typeof a, 'function');
        assert.equal(typeof b, 'function');
        assert.equal(b.Parent, a);

        var polymorphous = app.servicesContainer.get('main:polymorphous');

        assert.equal(typeof polymorphous.a, 'function');
        assert.equal(typeof polymorphous.b, 'function');
        assert.equal(typeof polymorphous.c, 'function');
        assert.equal(polymorphous.a(), 2);
        assert.equal(polymorphous.b(), 3);
        assert.equal(polymorphous.c(), 4);
    })

    it('should allow cross danf modules inheritance', function() {
        var computer = app.servicesContainer.get('main:computer');

        assert.equal(computer.inc(), 3);
        assert.equal(computer.inc(), 4);
    })

    it('should allow to process sequences of a triggered event', function(done) {
        var eventsContainer = app.servicesContainer.get('danf:event.eventsContainer'),
            event = eventsContainer.get('event', 'main:happenSomething');
        ;

        event.trigger({done: done});
    })

    it('should allow to process conditional sequences of a triggered event', function(done) {
        var eventsContainer = app.servicesContainer.get('danf:event.eventsContainer'),
            event = eventsContainer.get('event', 'main:happenSomething');
        ;

        event.trigger({data: {i: 2}, done: done});
    })

    it('should allow cross danf modules inheritance', function(done) {
        var trigger = app.servicesContainer.get('main:trigger');

        trigger.trigger(done);
    })

    it('should allow cross danf modules inheritance', function(done) {
        var trigger = app.servicesContainer.get('main:dep1:trigger');

        trigger.trigger(done);
    })

    it('should allow to manage asynchronous flow', function(done) {
        var eventsContainer = app.servicesContainer.get('danf:event.eventsContainer'),
            event = eventsContainer.get('event', 'main:dep3:parallelComputing');
        ;

        event.trigger({input: [1, 2, 3, 4, 5], expected: 5, done: done});
    })

    it('should allow to manage asynchronous flow', function(done) {
        var eventsContainer = app.servicesContainer.get('danf:event.eventsContainer'),
            event = eventsContainer.get('event', 'main:dep3:seriesComputing');
        ;

        event.trigger({input: [1, 2, 3, 4, 5], expected: 15, done: done});
    })

    it('should allow to manage asynchronous flow', function(done) {
        var eventsContainer = app.servicesContainer.get('danf:event.eventsContainer'),
            event = eventsContainer.get('event', 'main:dep3:parallelLimitComputing');
        ;

        event.trigger({input: [1, 2, 3, 4, 5], expected: 9, done: done}); // 1 unlock 3 unlock 5
    })

    it('should allow to manage asynchronous flow', function(done) {
        var eventsContainer = app.servicesContainer.get('danf:event.eventsContainer'),
            event = eventsContainer.get('event', 'main:dep3:compute');
        ;

        event.trigger({expected: 51, done: done});
    })

    it('should allow to manage asynchronous flow', function(done) {
        var eventsContainer = app.servicesContainer.get('danf:event.eventsContainer'),
            event = eventsContainer.get('event', 'main:dep3:sum');
        ;

        event.trigger({input: [1, 5, 10], expected: 16, done: done});
    })

    it('should handle environment configurations', function() {
        var timer = app.servicesContainer.get('main:timer');

        assert.equal(timer.timeOut, 2100);
        assert.equal(timer.interval, 20);
    })

    it('should allow to overwrite danf configuration', function() {
        var callbackExecutor = app.servicesContainer.get('danf:manipulation.callbackExecutor');

        assert.equal(typeof callbackExecutor.executeCallback, 'function');
        assert.equal(callbackExecutor.executeCallback(function() { return 3; }), 3);
    })

    it('should provide a service with utils', function() {
        var utils = app.servicesContainer.get('danf:utils'),
            a = {a: 1},
            b = {b: 2}
        ;

        assert.notEqual(utils, undefined);

        assert.deepEqual(
            utils.merge(a, b),
            {a:1, b:2}
        );
    })

    it('should process requests', function(done) {
        request(app)
            .get('/computing?val=1')
            .set('Accept', 'application/json')
            .expect(200, JSON.stringify({result: 69}))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) {
                    if (res) {
                        console.log(res.text);
                    } else {
                        console.log(err);
                    }

                    throw err;
                }

                done();
            })
        ;
    })

    it('should allow events inheritance', function(done) {
        var i = 0,
            requestTests = [
                {
                    path: '/api/inc/1',
                    method: 'get',
                    expected: 3
                },
                {
                    path: '/api/inc',
                    method: 'post',
                    expected: 4
                },
                {
                    path: '/api/inc/alter/3',
                    method: 'put',
                    expected: 5
                },
                {
                    path: '/api/inc/alter/4',
                    method: 'patch',
                    expected: 6
                },
                {
                    path: '/api/inc/6/dec/1',
                    method: 'get',
                    expected: 7
                }
            ],
            valid = function() {
                i++;

                if (i === requestTests.length) {
                    done();
                }
            }
        ;

        requestTests.forEach(function(test) {
            var requestMethod = request(app)[test.method];

            requestMethod(test.path)
                .set('Accept', 'application/json')
                .expect(
                    test.method === 'post' ? 201 : 200,
                    JSON.stringify({value: test.expected})
                )
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    if (err) {
                        if (res) {
                            console.log(res.text);
                        } else {
                            console.log(err);
                        }

                        throw err;
                    }

                    valid();
                })
            ;
        });
    })
})