'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    Event = require('../../../../lib/common/event/event'),
    EventNotifier = require('../../../../lib/common/event/notifier/event')
;

var eventNotifier = new EventNotifier(),
    dataResolver = require('../../../fixture/manipulation/data-resolver'),
    sequence = {
        execute: function(input, scope, callback) {
            input.bar = 'foo';
        }
    },
    event = new Event(
        'update',
        {
            callback: function(stream) {
                assert.deepEqual(
                    stream,
                    {
                        foo: 'bar',
                        bar: 'foo'
                    }
                );
            },
            contract: {
                foo: {type: 'string'}
            }
        },
        sequence,
        eventNotifier
    )
;

eventNotifier.dataResolver = dataResolver;

describe('Event notifier', function() {
    describe('method "notify"', function() {
        it('should notify listeners of an event triggering', function() {
            eventNotifier.addListener(event);
            eventNotifier.notify(event, {foo: 'bar'});
        })

        it('should fail to trigger an event with a bad formatted data', function() {
            assert.throws(
                function() {
                    eventNotifier.notify(event, {bar: 'foo'});
                },
                /The embedded field "bar" is not defined in the contract of the field "event\[event\]\[update\].data"./
            );
        })
    })
})