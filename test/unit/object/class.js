'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    utils = require('../../../lib/common/utils'),
    Flow = require('../../../lib/common/manipulation/flow'),
    Class = require('../../../lib/common/object/class')
;

function A() {
}
utils.extend(Class, A);
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
                    20
                );
            });
        })(i);
    }
}

function B(a) {
    this._a = a;
}
utils.extend(Class, B);
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

describe('Inheriting from Class should allow', function() {
    it('to process asynchrone tasks', function(done) {
        var flow = new Flow({}, null, function(err, result) {
                assert.deepEqual(
                    result,
                    {foo: 5}
                );
                done();
            }),
            a = new A(),
            b = new B(a)
        ;

        a.__asyncFlow = flow;

        b.u();
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {
                foo: 0,
                bar: 1,
                foobar: 2
            },
            flow = new Flow({}, null, function(err, result) {
                assert.deepEqual(result, expected);
                done();
            }),
            a = new A(),
            b = new B(a)
        ;

        a.__asyncFlow = flow;

        b.v(Object.keys(expected));
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {foo: {bar: 6}},
            flow = new Flow({}, 'foo', function(err, result) {
                assert.deepEqual(result, expected);
                done();
            }),
            a = new A(),
            b = new B(a)
        ;

        a.__asyncFlow = flow;

        b.w();
    })

    it('to process asynchrone tasks', function(done) {
        var expected = {foo: {bar: 8}},
            flow = new Flow({foo: {bar: 2}}, 'foo', function(err, result) {
                assert.deepEqual(result, expected);
                done();
            }),
            a = new A(),
            b = new B(a)
        ;

        a.__asyncFlow = flow;

        b.w();
    })
})