'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Flow = require('../../../lib/common/manipulation/flow'),
    Sequence = require('../../../lib/common/sequencing/sequence'),
    ProxyExecutor = require('../../../lib/common/manipulation/proxy-executor')
;

var mapProvider = require('../../fixture/manipulation/map-provider');

var proxyExecutor = new ProxyExecutor(),
    computer = {
        add: function(a, b) {
            return a + b;
        }
    },
    asyncComputer = {
        add: function(a, b) {
            this.__asyncProcess(function(async) {
                setTimeout(
                    async(function() {
                        return a + b;
                    }),
                    10
                );
            });
        }
    }
;

describe('ProxyExecutor', function() {
    it('method "execute" should execute a method of an object', function() {
        var result = proxyExecutor.execute(
            computer,
            'add',
            2,
            3
        );

        assert.equal(result, 5);
    })

    it('method "executeAsync" should execute an asynchronous method of an object', function(done) {
        var flow = new Flow();

        flow.stream = {};
        flow.initialScope = null;
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, {foo: 7});
            done();
        };
        flow.__init();

        proxyExecutor.__asyncFlow = flow;

        proxyExecutor.executeAsync(
            asyncComputer,
            'add',
            'foo',
            4,
            3
        );
    })
})