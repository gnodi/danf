'use strict';

module.exports = AbstractComputer;

function AbstractComputer() {
}

AbstractComputer.prototype.compute = function() {
    return this.value * 2;
}