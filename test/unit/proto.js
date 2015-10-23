'use strict';

var assert = require('assert'),
    path = require('path'),
    danf = require('../../lib/server/app')
;

var rootPath = path.join(_dirname, '/../fixture/proto');

describe('Danf proto application', function() {
    it('should build its configuration from files, folders and node modules', function() {
        assert.deepEqual(
            danf.prototype.buildServerConfiguration(rootPath, 'danf'),
            {}
        );

        assert.deepEqual(
            danf.prototype.buildSpecificConfiguration(rootPath, 'danf', 'client'),
            {}
        );
    })
}