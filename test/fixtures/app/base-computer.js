'use strict';

var Computer = function(displayer, count) {
    this.displayer = displayer;
    this.count = count || 1;
};

Computer.defineDependency('displayer', 'displayer');

Computer.prototype.display = function() {
    return this.displayer.display(this.counter);
};

module.exports = Computer;