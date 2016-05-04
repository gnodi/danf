'use strict';

module.exports = {
    messenger: {
        methods: {
            /**
             * Emit a message.
             *
             * @param {string} name The message name.
             * @param {mixed|null} data The data.
             * @param {string|string_array|null} target The message target.
             */
            emit: {
                arguments: [
                    'string/name',
                    'mixed|null/data',
                    'string|string_array|null/target',
                    'object/config',
                    'function/callback'
                ]
            },
            /**
             * Join a room.
             *
             * @param {string} room The room name.
             */
            joinRoom: {
                arguments: [
                    'string/room'
                ]
            },
            /**
             * Leave a room.
             *
             * @param {string} room The room name.
             */
            leaveRoom: {
                arguments: [
                    'string/room'
                ]
            }
        }
    }
};