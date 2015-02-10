'use strict';

require('../../lib/init');

var assert = require('assert'),
    NotifierRegistry = require('../../lib/manipulation/notifier-registry')
;

var registry = new NotifierRegistry();

var Observer = function() {
    this.initialize();
}
Observer.prototype.handleRegistryChange = function(items, reset, name) {
    this.name = name;
    this.items = items;
    this.reset = reset;
};
Observer.prototype.initialize = function() {
    this.name = null;
    this.items = null;
    this.reset = null;
};

var fooObserver = new Observer(),
    barObserver = new Observer()
;

describe('NotifierRegistry', function() {
    it('method "register and get" should allow to register and retrieve value from registry', function() {
        registry.register('foo', 1);
        registry.register('bar', 3);

        assert.equal(registry.get('foo'), 1);
        assert.equal(registry.get('bar'), 3);
    })

    it('method "has" should check the existence of a registered value', function() {
        assert.equal(registry.has('foo'), true);
        assert.equal(registry.has('dumb'), false);
    })

    it('method "registerSet" allow to register a set of values', function() {
        registry.registerSet({
            a: 1,
            b: 2,
            c: 3
        });

        assert.equal(registry.has('a'), true);
        assert.equal(registry.get('c'), 3);
    })

    it('method "registerSet" should allow to register a set of values', function() {
        registry.registerSet({
            a: 1,
            b: 2,
            c: 3
        });

        assert.equal(registry.has('a'), true);
        assert.equal(registry.get('c'), 3);
    })

    it('method "getAll" should retrieve all the registered values', function() {
        assert.deepEqual(
            registry.getAll(),
            {
                foo: 1,
                bar: 3,
                a: 1,
                b: 2,
                c: 3
            }
        );
    })

    it('method "deregister" should deregister a specific registered value', function() {
        registry.deregister('a');

        assert.equal(registry.has('a'), false);
        assert.deepEqual(
            registry.getAll(),
            {
                foo: 1,
                bar: 3,
                b: 2,
                c: 3
            }
        );
    })

    it('method "deregisterAll" should deregister all registered values', function() {
        registry.deregisterAll();

        assert.equal(registry.has('b'), false);
        assert.deepEqual(
            registry.getAll(),
            {}
        );
    })

    it('method "get" should fail to retrieve a not registered value', function() {
        assert.throws(
            function() {
                registry.name = 'values';
                registry.get('foo');
            },
            'The item "foo" has not been registered in the list of "values"\.'
        );
    })

    it('method "addObserver" should add an observer on value (de)registering', function() {
        registry.addObserver(fooObserver);
        registry.addObserver(barObserver);

        registry.register('foo', 1);

        assert.equal(fooObserver.name, 'values');
        assert.equal(fooObserver.reset, false);
        assert.deepEqual(
            fooObserver.items,
            {
                foo: 1
            }
        );

        assert.equal(barObserver.name, 'values');
        assert.equal(barObserver.reset, false);
        assert.deepEqual(
            barObserver.items,
            {
                foo: 1
            }
        );

        registry.registerSet({
            a: 1,
            b: 2,
            c: 3
        });

        assert.equal(fooObserver.name, 'values');
        assert.equal(fooObserver.reset, false);
        assert.deepEqual(
            fooObserver.items,
            {
                a: 1,
                b: 2,
                c: 3
            }
        );

        registry.deregister('foo');

        assert.equal(fooObserver.name, 'values');
        assert.equal(fooObserver.reset, true);
        assert.deepEqual(
            fooObserver.items,
            {
                foo: 1
            }
        );

        registry.deregisterAll();

        assert.equal(fooObserver.name, 'values');
        assert.equal(fooObserver.reset, true);
        assert.deepEqual(
            fooObserver.items,
            {
                a: 1,
                b: 2,
                c: 3
            }
        );
    })

    it('method "removeObserver" should remove an observer', function() {
        fooObserver.initialize();
        barObserver.initialize();

        registry.removeObserver(barObserver);

        registry.register('foo', 1);

        assert.equal(fooObserver.name, 'values');
        assert.equal(fooObserver.reset, false);
        assert.deepEqual(
            fooObserver.items,
            {
                foo: 1
            }
        );

        assert.equal(barObserver.name, null);
        assert.equal(barObserver.reset, null);
        assert.equal(barObserver.items, null);
    })

    it('method "removeAllObserver" should remove all observers', function() {
        fooObserver.initialize();

        registry.removeAllObservers();

        registry.register('foo', 1);

        assert.equal(fooObserver.name, null);
        assert.equal(fooObserver.reset, null);
        assert.equal(fooObserver.items, null);
    })
})