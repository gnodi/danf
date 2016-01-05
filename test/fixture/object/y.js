'use strict';

class Y extends Function.getReference('x') {
    f() {
        return super.f() + 2;
    }

    h() {
        return 4;
    }
}

module.exports = Y;