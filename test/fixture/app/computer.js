'use strict';

var Computer = function(counter) {
    this.counter = counter;

    Computer.Parent.call(this, null, 2);
};

Computer.defineExtendedClass('dep1:computer');
Computer.defineDependency('counter', 'dep1:module10:counter');

Computer.prototype.inc = function() {
    if (this.counter.count < this.count) {
        this.counter.count = this.count;
    }

    this.counter.inc();

    return Computer.Parent.prototype.display.call(this);
};

module.exports = Computer;