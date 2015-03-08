'use strict';

require('../../../../../lib/common/init');

var assert = require('assert'),
    Events = require('../../../../../lib/common/event/configuration/section-processor/events')
;

var events = new Events(),
    eventNotifier = {
        name: 'event',
        contract: {
            event: {type: 'string'}
        }
    },
    requestNotifier = {
        name: 'request',
        contract: {
            path: {type: 'string'},
            methods: {type: 'string_array'}
        }
    }
;

events.addNotifier(eventNotifier);
events.addNotifier(requestNotifier);

describe('Events section configuration processor', function() {
    it('should aggregate the contracts of notifiers', function() {
        assert.deepEqual(
            events.contract,
            {
                event: {
                    type: 'embedded_object',
                    namespaces: true,
                    references: ['$'],
                    embed: {
                        event: {type: 'string'},
                        sequences: {type: 'string_array', default: [], namespaces: true},
                        contract: {type: 'mixed_object'}
                    }
                },
                request: {
                    type: 'embedded_object',
                    namespaces: true,
                    references: ['$'],
                    embed: {
                        path: {type: 'string'},
                        methods: {type: 'string_array'},
                        sequences: {type: 'string_array', default: [], namespaces: true},
                        contract: {type: 'mixed_object'}
                    }
                }
            }
        );
    })
})