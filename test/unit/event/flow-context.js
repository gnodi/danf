'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    FlowContext = require('../../../lib/common/event/flow-context'),
    Flow = require('../../../lib/common/manipulation/flow')
;

var mapProvider = require('../../fixture/manipulation/map-provider'),
    flow = new Flow(),
    flowContext = new FlowContext()
;

flow.stream = {};
flow.initialScope = '.';
flow.context = mapProvider.provide();

flowContext.__asyncFlow = flow;

describe('FlowContext', function() {
    it('method "set and get" should allow to set and retrieve value from the flow context', function() {
        flowContext.set('foo', 1);
        flowContext.set('bar', 3);

        assert.equal(flowContext.get('foo'), 1);
        assert.equal(flowContext.get('bar'), 3);
    })

    it('method "has" should check the existence of a setted value', function() {
        assert.equal(flowContext.has('foo'), true);
        assert.equal(flowContext.has('dumb'), false);
    })

    it('method "getAll" should retrieve all the seted values', function() {
        assert.deepEqual(
            flowContext.getAll(),
            {
                foo: 1,
                bar: 3
            }
        );
    })

    it('method "unset" should unset a specific setted value', function() {
        flowContext.unset('foo');

        assert.equal(flowContext.has('a'), false);
        assert.deepEqual(
            flowContext.getAll(),
            {
                bar: 3
            }
        );
    })

    it('method "clear" should unset all setted values', function() {
        flowContext.clear();

        assert.equal(flowContext.has('bar'), false);
        assert.deepEqual(
            flowContext.getAll(),
            {}
        );
    })

    it('method "get" should fail to retrieve a not setted value', function() {
        assert.throws(
            function() {
                flowContext.name = 'values';
                flowContext.get('foo');
            },
            'The item "foo" has not been setted in the list of "values"\.'
        );
    })
})