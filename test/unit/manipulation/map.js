'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Map = require('../../../lib/common/manipulation/map')
;

var map = new Map();

describe('Map', function() {
    it('method "set and get" should allow to set and retrieve value from map', function() {
        map.set('foo', 1);
        map.set('bar', 3);

        assert.equal(map.get('foo'), 1);
        assert.equal(map.get('bar'), 3);
    })

    it('method "has" should check the existence of a seted value', function() {
        assert.equal(map.has('foo'), true);
        assert.equal(map.has('dumb'), false);
    })

    it('method "getAll" should retrieve all the seted values', function() {
        assert.deepEqual(
            map.getAll(),
            {
                foo: 1,
                bar: 3
            }
        );
    })

    it('method "unset" should unset a specific seted value', function() {
        map.unset('foo');

        assert.equal(map.has('a'), false);
        assert.deepEqual(
            map.getAll(),
            {
                bar: 3
            }
        );
    })

    it('method "clear" should unset all seted values', function() {
        map.clear();

        assert.equal(map.has('bar'), false);
        assert.deepEqual(
            map.getAll(),
            {}
        );
    })

    it('method "get" should fail to retrieve a not seted value', function() {
        assert.throws(
            function() {
                map.name = 'values';
                map.get('foo');
            },
            'The item "foo" has not been seted in the list of "values"\.'
        );
    })
})