'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    Asynchronizer = require('../../../../lib/common/object/class-processor/asynchronizer')
;

var AsynchronousClass = function() {
};

AsynchronousClass.prototype.asynchronousMethod = function() {
    this.__async();
};

AsynchronousClass.prototype.synchronousMethod = function() {
};

var asynchronizer = new Asynchronizer();

describe('Asynchronizer', function() {
    describe('method "process"', function() {
        it('should build defined inheritance between classes', function() {
            asynchronizer.process(AsynchronousClass);
        })
    })
})