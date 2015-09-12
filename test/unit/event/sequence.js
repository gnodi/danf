'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    utils = require('../../../lib/common/utils'),
    Flow = require('../../../lib/common/manipulation/flow'),
    Sequence = require('../../../lib/common/event/sequence')
;

var mapProvider = require('../../fixture/manipulation/map-provider');

function A() {
}
A.prototype.f = function(i, j) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(i + j);
            },
            20
        );
    });
}
A.prototype.g = function() {
    var self = this;

    for (var i = 0; i <= 3; i++) {
        (function(i) {
            self.__asyncProcess(function(returnAsync) {
                setTimeout(
                    function() {
                        returnAsync(function(stream) {
                            if (null == stream) {
                                stream = 0;
                            }

                            return stream + i;
                        });
                    },
                    40 - (i * 10)
                );
            });
        })(i);
    }
}
A.prototype.h = function(i, j) {
    return i + j;
}

function B(a) {
    this._a = a;
}
B.prototype.u = function() {
    this._a.f.__asyncCall(this._a, 'foo', 2, 3);
}
B.prototype.v = function(keys) {
    for (var i = 0; i < keys.length; i++) {
        this._a.f.__asyncCall(this._a, keys[i], i, 0);
    }
}
B.prototype.w = function() {
    this._a.g.__asyncCall(this._a, 'bar');
}
B.prototype.x = function(key) {
    this._a.f.__asyncCall(this._a, key, 1, 2);
}
B.prototype.y = function() {
    this._a.h.__asyncCall(this._a, '.', 3, 2);
}
B.prototype.z = function() {
    this._a.h.__asyncCall(this._a, null, 3, 2);
}

function C(b) {
    this._b = b;
}
C.prototype.m = function(keys) {
    this._b.u.__asyncCall(this._b, 'main', keys);
    this._b.v.__asyncCall(this._b, 'app', keys);
}

describe('Inheriting from __async properties should allow', function() {
    it('to process asynchrone tasks', function(done) {
        var expected = {foo: 5},
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {};
        flow.initialScope = null;
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.u();
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {
                foo: 0,
                bar: 1,
                foobar: 2
            },
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {};
        flow.initialScope = null;
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.v(Object.keys(expected));
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {foo: {bar: 6}},
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {};
        flow.initialScope = 'foo';
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.w();
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {foo: {bar: 8}},
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {foo: {bar: 2}};
        flow.initialScope = 'foo';
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.w();
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {
                foo: {
                    main: {
                        foo: 5
                    },
                    app: {
                        foo: 0,
                        bar: 1,
                        foobar: 2
                    }
                }
            },
            flow = new Flow(),
            a = new A(),
            b = new B(a),
            c = new C(b)
        ;

        flow.stream = {};
        flow.initialScope = 'foo';
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        c.m(Object.keys(expected.foo.app));
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {
                foo: {
                    main: {
                        foo: 5
                    },
                    app: {
                        foo: 0,
                        bar: 1,
                        foobar: 2
                    },
                    bar: 2
                }
            },
            flow = new Flow(),
            a = new A(),
            b = new B(a),
            c = new C(b)
        ;

        flow.stream = {foo: {bar: 2}};
        flow.initialScope = 'foo';
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        c.m(Object.keys(expected.foo.app));
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {foo: {bar: 3}},
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {};
        flow.initialScope = null;
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.x('foo.bar');
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {'foo.bar': 3},
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {};
        flow.initialScope = null;
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.x('`foo.bar`');
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {
                foo: {
                    'foo.bar': {
                        main: {
                            'bar.foo': 3
                        }
                    }
                }
            },
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {};
        flow.initialScope = 'foo';
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.x('`foo.bar`.main.`bar.foo`');
    })

    it('to process asynchrone tasks', function(done) {
        var expected = 5,
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = {};
        flow.initialScope = null;
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.y();
    })

    it('to process asynchrone tasks', function(done) {
        var expected = null,
            flow = new Flow(),
            a = new A(),
            b = new B(a)
        ;

        flow.stream = null;
        flow.initialScope = null;
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(result, expected);
            done();
        };
        flow.__init();

        a.__asyncFlow = flow;

        b.z();
    })
})
