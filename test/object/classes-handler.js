'use strict';

require('../../lib/init');

var assert = require('assert'),
    ClassesHandler = require('../../lib/object/classes-handler'),
    ClassesIndexer = require('../../lib/object/classes-indexer')
;

var A = function() {},
    B = function() {}
;

var classesIndexer = new ClassesIndexer(),
    classesHandler = new ClassesHandler(classesIndexer),
    ClassProcessor = function() {
    }
;

ClassProcessor.prototype.process = function(class_) {
    class_.a = 2;
}

classesIndexer.index('a', A);
classesIndexer.index('b', B);

describe('ClassesHandler', function() {
    describe('method "process"', function() {
        it('should call the process method of all the added class processors', function() {
            classesHandler.addClassProcessor(new ClassProcessor());
            classesHandler.process(A);

            assert.equal(A.a, 2);
        })
    })
})