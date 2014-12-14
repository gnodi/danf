'use strict';

require('../../lib/init');

var assert = require('assert'),
    ClassesHandler = require('../../lib/object/classes-handler'),
    ClassesRegistry = require('../../lib/object/classes-registry')
;

var A = function() {},
    B = function() {}
;

var classesRegistry = new ClassesRegistry(),
    classesHandler = new ClassesHandler(classesRegistry),
    ClassProcessor = function() {
    }
;

ClassProcessor.prototype.process = function(class_) {
    class_.a = 2;
}

classesRegistry.index('a', A);
classesRegistry.index('b', B);

describe('ClassesHandler', function() {
    describe('method "process"', function() {
        it('should call the process method of all the added class processors', function() {
            classesHandler.addClassProcessor(new ClassProcessor());
            classesHandler.process(A);

            assert.equal(A.a, 2);
        })
    })
})