'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    Extender = require('../../../../lib/common/object/class-processor/extender'),
    ClassesContainer = require('../../../../lib/common/object/classes-container')
;

var A = function() {
    this._a = 1;
    this._b = 1;
    this._c = 1;
};

A.prototype.a = function() {
    return ++this._a;
};

A.prototype.b = function() {
    return ++this._b;
};

A.prototype.c = function() {
    return ++this._c;
};

var B = function() {
    B.Parent.call(this);
};

B.defineExtendedClass('a');

B.prototype.b = function() {
    this._b++;

    return B.Parent.prototype.b.call(this);
};

B.prototype.c = function() {
    this._c++;

    return B.Parent.prototype.c.call(this);
};

var C = function() {
    C.Parent.call(this);
};

C.defineExtendedClass('b');

C.prototype.c = function() {
    this._c++;

    return C.Parent.prototype.c.call(this);
};

var classesContainer = new ClassesContainer(),
    extender = new Extender()
;

classesContainer.setDefinition('a', A);
classesContainer.setDefinition('b', B);
classesContainer.setDefinition('c', C);

extender.classesContainer = classesContainer;

describe('Extender', function() {
    describe('method "process"', function() {
        it('should build defined inheritance between classes', function() {
            extender.process(C);

            var object = new C();

            assert.equal(typeof object.a, 'function');
            assert.equal(typeof object.b, 'function');
            assert.equal(typeof object.c, 'function');
            assert.equal(object.a(), 2);
            assert.equal(object.b(), 3);
            assert.equal(object.c(), 4);
        })
    })
})

// Test ES6 class.
if (parseFloat(process.version.replace('v', '')) > 2) {
    var X = require('../../../fixture/object/x'),
        Y = require('../../../fixture/object/y'),
        Z = require('../../../fixture/object/z')
    ;

    classesContainer.setDefinition('x', X);
    classesContainer.setDefinition('y', Y);
    classesContainer.setDefinition('z', Z);

    describe('Extender', function() {
        describe('method "process"', function() {
            it('should process ES6 class syntaxic sugar', function() {
                extender.process(X);

                var object = new X();

                assert.equal(typeof object.f, 'function');
                assert.equal(typeof object.g, 'function');
                assert.equal(typeof object.h, 'undefined');
                assert.equal(typeof object.i, 'undefined');
                assert.equal(object.f(), 1);
                assert.equal(object.g(), 2);

                extender.process(Y);

                var object = new Y();

                assert.equal(typeof object.f, 'function');
                assert.equal(typeof object.g, 'function');
                assert.equal(typeof object.h, 'function');
                assert.equal(typeof object.i, 'undefined');
                assert.equal(object.f(), 3);
                assert.equal(object.g(), 2);
                assert.equal(object.h(), 4);

                extender.process(Z);

                var object = new Z();

                assert.equal(typeof object.f, 'function');
                assert.equal(typeof object.g, 'function');
                assert.equal(typeof object.h, 'function');
                assert.equal(typeof object.i, 'function');
                assert.equal(object.f(), 5);
                assert.equal(object.g(), 2);
                assert.equal(object.h(), 4);
                assert.equal(object.i(), 6);
            })
        })
    })
}