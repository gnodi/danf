'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Flow = require('../../../lib/common/manipulation/flow')
;

describe('Flow', function() {
    it('should allow to wait for asynchrone tasks to process', function(done) {
        var flow = new Flow(10, null, function(err, result) {
                assert.equal(result, 16);
                done();
            })
        ;

        for (var i = 0; i <= 3; i++) {
            (function(i) {
                var task = flow.wait();

                setTimeout(
                    function() {
                        flow.end(task, function(stream) {
                            if (null == stream) {
                                stream = 0;
                            }

                            return stream + i;
                        });
                    },
                    20
                )
            })(i);
        }
    })

    it('should allow to wait for tributary asynchrone tasks to process', function(done) {
        var flow = new Flow({}, 'foo', function(err, result) {
                assert.deepEqual(
                    result,
                    {
                        foo: {
                            bar1: 6,
                            bar2: {
                                bar3: 10,
                                bar4: 14
                            }
                        }
                    }
                );
                done();
            }),
            add = function(value) {
                var task = flow.wait();

                setTimeout(
                    function() {
                        flow.end(task, function(stream) {
                            if (null == stream) {
                                stream = 0;
                            }

                            return stream + value;
                        });
                    },
                    20
                )
            },
            j = 0
        ;

        var tributary = flow.addTributary('bar1');

        for (var i = j; i <= j + 3; i++) {
            add(i);
        }

        j += 1;

        flow.mergeTributary(tributary);
        flow.addTributary('bar2');
        var tributary = flow.addTributary('bar3');

        for (var i = j; i <= j + 3; i++) {
            add(i);
        }

        j += 1;

        flow.mergeTributary(tributary);
        flow.addTributary('bar4');

        for (var i = j; i <= j + 3; i++) {
            add(i);
        }
    })
})