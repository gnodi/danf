'use strict';

class E extends Function.getReference('d') {
    constructor() {
        super();
    }

    c() {
        return super.c() + 2;
    }
}

module.exports = E;