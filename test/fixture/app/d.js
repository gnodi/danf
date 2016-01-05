'use strict';

class D extends Function.getReference('c') {
    constructor() {
        super();
    }

    c() {
        return super.c() + 1;
    }

    d() {
        return 11;
    }
}

D.defineImplementedInterfaces(['d']);

module.exports = D;