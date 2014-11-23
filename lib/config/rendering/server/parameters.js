'use strict';

module.exports = {
    classes: {
        renderer: require('../../../rendering/renderer'),
        formatRenderer: {
            text: require('../../../rendering/format-renderer/text'),
            json: require('../../../rendering/format-renderer/json'),
            html: require('../../../rendering/format-renderer/html')
        }
    },
    layout: __dirname + '/../../../rendering/view/layout.jade'
};