'use strict';

module.exports = {
    command: require('../../../lib/common/command/command'),
    parser: require('../../../lib/common/command/parser'),
    event: {
        notifier: {
            command: require('../../../lib/common/command/event/notifier/command')
        }
    }
};