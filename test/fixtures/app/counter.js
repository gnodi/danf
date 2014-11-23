'use strict';

module.exports = Counter;

function Counter() {}

Counter.prototype.inc = function(value, inc) {
    return value + inc;
};

Counter.prototype.dec = function(value, dec) {
    return value - dec;
};