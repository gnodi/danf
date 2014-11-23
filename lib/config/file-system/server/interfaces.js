'use strict';

module.exports = {
    mapper: {
        methods: {
            /**
             * Match a mapping for a path.
             *
             * @param {string} path The path of the file to match.
             * @return {string} The mapped path.
             */
            match: {
                arguments: ['string/path'],
                returns: 'string'
            }
        }
    }
};