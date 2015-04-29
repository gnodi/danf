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
            100
        );
    });
}

function B(a) {
    this._a = a;
}
utils.extend(Class, B);
B.prototype.u = function() {
    this._a.f.__asyncCall(this._a, 'foo', 2, 3);
}

describe('Inheriting from Class should allow', function() {
    it('to process asynchrone task', function(done) {
        var stream = {},
            flow = new Flow(stream, function(err, result) {
                assert.equal(result, 5);
                done();
            }),
            a = new A(),
            b = new B(a)
        ;

        a.__asyncFlow = flow;

        b.u();
    })
})