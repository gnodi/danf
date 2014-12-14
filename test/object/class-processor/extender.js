'use strict';

require('../../../lib/init');

var assert = require('assert'),
    Extender = require('../../../lib/object/class-processor/extender'),
    ClassesHandler = require('../../../lib/object/classes-handler'),
    ClassesRegistry = require('../../../lib/object/classes-registry')
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

module.exports = B;

var C = function() {
    C.Parent.call(this);
};

C.defineExtendedClass('b');

C.prototype.c = function() {
    this._c++;

    return C.Parent.prototype.c.call(this);
};

module.exports = C;

var classesRegistry = new ClassesRegistry(),
    classesHandler = new ClassesHandler(classesRegistry),
    extender = new Extender(classesRegistry)
;

classesRegistry.index('a', A);
classesRegistry.index('b', B);
classesRegistry.index('c', C);

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