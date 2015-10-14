'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ClassesContainer = require('../../../lib/common/object/classes-container')
;

var A = function() {},
    B = function() {},
    C = function() {}
;

var classesContainer = new ClassesContainer(),
    ClassProcessor = function() {
    }
;

ClassProcessor.prototype.process = function(class_) {
    class_.a = 2;
}

classesContainer.addClassProcessor(new ClassProcessor());

var config = {
        a: A,
        b: B
    }
;

describe('ClassesContainer', function() {
    classesContainer.handleRegistryChange(config);

    it('method "handleRegistryChange" should set the definitions of the configured classes and build them', function() {
        assert(classesContainer.hasDefinition('a'));
        assert(classesContainer.hasDefinition('b'));
        assert(classesContainer.has('a'));
        assert(classesContainer.has('b'));
    })

    it('method "get" should return a class processed by class processors', function() {
        var A = classesContainer.get('a'),
            B = classesContainer.get('b')
        ;

        assert.equal(A.a, 2);
        assert.equal(B.a, 2);
    })

    it('method "setDefinition" allow to add a class definition', function() {
        assert.equal(C.a, undefined);

        classesContainer.setDefinition('c', C);

        var Class = classesContainer.get('c');

        assert.equal(Class.a, 2);
    })
})