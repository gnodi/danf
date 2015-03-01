'use strict';

require('../../../lib/init');

var assert = require('assert'),
    CallbackExecutor = require('../../../lib/common/manipulation/callback-executor')
;

var callbackExecutor = new CallbackExecutor();

describe('CallbackExecutor', function() {
    it('should execute a callback', function() {
        var result = callbackExecutor.execute(
            function(i, j) {
                return i + j;
            },
            2,
            3
        );

        assert.equal(result, 5);
    })
})