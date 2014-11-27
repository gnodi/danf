'use strict';

var C = function() {
    C.Parent.call(this);
};

C.defineExtendedClass('b');

C.prototype.c = function() {
    this._c++;

    return C.Parent.prototype.c.call(this);
};

module.exports = C;