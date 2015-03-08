'use strict';

module.exports = {
    renderer: require('../../../lib/server/rendering/renderer'),
    formatRenderer: {
        text: require('../../../lib/server/rendering/format-renderer/text'),
        json: require('../../../lib/server/rendering/format-renderer/json'),
        html: require('../../../lib/server/rendering/format-renderer/html')
    }
};