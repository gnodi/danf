'use strict';

module.exports = {
    router: {
        class: 'danf:http.router',
        properties: {
            routeProvider: '#danf:http.routeProvider#',
            eventsContainer: '#danf:event.eventsContainer#'
        }
    },
    routeProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:http.route',
            interface: 'danf:http.route'
        }
    }
}