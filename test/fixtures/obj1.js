'use strict';

module.exports = Obj1;

function Obj1(string, integer) {
    this.string = string;
    this._integer = integer;
}

Obj1.prototype.test = function () {
    return this.string;
}