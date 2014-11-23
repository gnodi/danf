'use strict';

require('../../../lib/init');

var assert = require('assert'),
    Event = require('../../../lib/event/notifier/event')
;

var eventNotifier = new Event(),
    dataResolver = require('../../fixtures/manipulation/data-resolver'),
    sequencer = {
        start: function(stream, callback) {
            stream.data.bar = 'foo';

            callback(stream);
        }
    }
;

eventNotifier.dataResolver = dataResolver;

describe('Event notifier', function() {
    describe('method "notify"', function() {
        it('should notify listeners of an event triggering', function() {
            eventNotifier.addListener(
                'update',
                {
                    context: 'foo',
                    callback: function(stream) {
                        assert.deepEqual(
                            stream,
                            {
                                context: 'foo',
                                data: {
                                    foo: 'bar',
                                    bar: 'foo'
                                }
                            }
                        );
                    },
                    contract: {
                        foo: {type: 'string'}
                    }
                },
                sequencer
            );

            eventNotifier.notify('update', {foo: 'bar'});
        })

        it('should fail to trigger an event with a bad formatted data', function() {
            assert.throws(
                function() {
                    eventNotifier.notify('update', {bar: 'foo'});
                },
                /The embedded field "bar" is not defined in the contract of the field "event\[event\]\[update\].data"./
            );
        })
    })
})