'use strict';

module.exports = {
    renderer: require('../../../rendering/renderer'),
    formatRenderer: {
        text: require('../../../rendering/format-renderer/text'),
        json: require('../../../rendering/format-renderer/json'),
        html: require('../../../rendering/format-renderer/html')
    }
};