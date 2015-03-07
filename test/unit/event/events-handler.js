'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    EventsHandler = require('../../../lib/common/event/events-handler')
;

var eventsHandler = new EventsHandler(),
    sequenceBuilder = {
        compose: function() {
            return [];
        }
    },
    notifier = {
        name: 'event',
        addListener: function(name) {
            notifier.event = name;
        },
        notify: function (name, data) {
            notifier.event = '{0}.{1}'.format(name, data);
        }
    }
;

eventsHandler.sequenceBuilder = sequenceBuilder;

describe('EventsHandler', function() {
    it('should add listeners to its notifiers', function() {
        eventsHandler.addNotifier(notifier);
        eventsHandler.addEvent('event', 'click', {sequences: []});

        assert.equal(notifier.event, 'click');
    }),

    it('method "trigger" should notify the event triggering to its notifiers', function() {
        eventsHandler.trigger('event', 'click', {}, 'triggered');

        assert.equal(notifier.event, 'click.triggered');
    })
})