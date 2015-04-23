'use strict';

module.exports = Obj2;

function Obj2(object, integer, string, parameter) {
    this.dependency = object;
    this._string = string;
    this._integer = integer;
    this.parameter = parameter;
}

Obj2.prototype.test = function () {
    return this._string;
}