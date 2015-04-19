'use strict';

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