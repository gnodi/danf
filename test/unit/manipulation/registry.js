'use strict';

require('../../../lib/init');

var assert = require('assert'),
    Registry = require('../../../lib/common/manipulation/registry')
;

var registry = new Registry();

describe('Registry', function() {
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
})