'use strict';

class Z extends Function.getReference('y') {
    f() {
        return super.f() + 2;
    }

    i() {
        return 6;
    }
}

module.exports = Z;