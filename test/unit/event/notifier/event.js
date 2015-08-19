'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    Event = require('../../../../lib/common/event/event'),
    EventNotifier = require('../../../../lib/common/event/notifier/event')
;

var eventNotifier = new EventNotifier(),
    dataResolver = require('../../../fixture/manipulation/data-resolver'),
    sequence = {
        execute: function(input, context, scope, callback) {
            input.bar = 'foo';
            input.a = context.a;
        }
    },
    event = new Event(
        'update',
        {
            context: {
                a: 1
            },
            callback: function(stream) {
                assert.deepEqual(
                    stream,
                    {
                        foo: 'bar',
                        bar: 'foo',
                        a: 1
                    }
                );
            },
            parameters: {
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