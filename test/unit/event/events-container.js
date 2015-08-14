'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Event = require('../../../lib/common/event/event'),
    EventsContainer = require('../../../lib/common/event/events-container')
;

var data = {name: 'triggered'},
    eventsContainer = new EventsContainer(),
    sequence = {
        execute: function(input, scope, callback) {
            assert.equal(input, data);
        }
    },
    sequencesContainer = {
        sequence: null,
        setDefinition: function() {
            sequencesContainer.sequence = sequence;
        },
        get: function() {
            return sequencesContainer.sequence;
        }
    },
    notifier = {
        name: 'event',
        addListener: function(event) {
            notifier.event = event.name;
        },
        notify: function (event, data) {
            notifier.event = '{0}.{1}'.format(event.name, data.name);
        }
    },
    eventProvider = {
        provide: function() {
            return new Event('click', {}, sequence, notifier);
        }
    }
;

eventsContainer.sequencesContainer = sequencesContainer;
eventsContainer.eventProvider = eventProvider;

describe('EventsContainer', function() {
    it('should allow to retrieve an event', function() {
        eventsContainer.setNotifier(notifier);
        eventsContainer.setDefinition('event', 'click', {});
        var event = eventsContainer.get('event', 'click');

        Object.isInstanceOf(event, 'danf:event.event');
    })

    it('should add listeners to its notifiers', function() {
        assert.equal(notifier.event, 'click');

        var event = eventsContainer.get('event', 'click');
        event.trigger(data);

        assert.equal(notifier.event, 'click.triggered');
    })
})