'use strict';

var assert = require('assert'),
    TestHelper = require('danf/lib/test/test-helper'),
    configuration = require('../danf'),
    testHelper = new TestHelper(configuration)
;

describe('Computer', function() {
    // Test the class.
    it('should compute correctly', function() {
        var computer = testHelper.getInstance('computer')

        assert.equal(computer.compute(), 6);
    })

    // Test the service.
    it('should compute correctly', function() {
        var computer = testHelper.getService('computer')

        assert.equal(computer.compute(), 8);
    })
})