'use strict';

var assert = require('assert'),
    danf = require('../lib/app')
;

var app = danf(require(__dirname + '/fixtures/danf'), {silent: true, environment: 'test'});

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
        var classesRegistry = app.servicesContainer.get('danf:object.classesRegistry'),
            a = classesRegistry.get('main:a'),
            b = classesRegistry.get('main:b')
        ;

        assert(typeof a, 'function');
        assert(typeof b, 'function');
        assert(b.Parent, a);

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

    it('should allow cross danf modules inheritance', function(done) {
        var trigger = app.servicesContainer.get('main:trigger');

        trigger.trigger(done);
    })

    it('should allow cross danf modules inheritance', function(done) {
        var trigger = app.servicesContainer.get('main:dep1:trigger');

        trigger.trigger(done);
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

    it('should process basic events', function(done) {
        var trigger = app.servicesContainer.get('danf:event.eventsHandler'),
            computer = app.servicesContainer.get('main:computer')
        ;

        trigger.trigger('event', 'happenSomething', computer, {i: 3, k: 3, done: done});
    })

    it('should process basic events', function(done) {
        var trigger = app.servicesContainer.get('danf:event.eventsHandler'),
            computer = app.servicesContainer.get('main:computer')
        ;

        trigger.trigger('event', 'happenSomething', computer, {k: 0, done: done});
    })
})