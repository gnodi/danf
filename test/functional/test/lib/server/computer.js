'use strict';

module.exports = Computer;

function Computer() {
    this.value = 3;
}

Computer.defineExtentedClass('abstractComputer');

Object.defineProperty(Computer.prototype, 'value', {
    get: function() { return this._value; },
    set: function(value) { this._value = value; }
});