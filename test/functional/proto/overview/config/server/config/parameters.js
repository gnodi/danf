'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    fs = require('fs')
;

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/configuration.md
 */
module.exports = {
    view: {
        path: fs.realpathSync(
            path.join(__dirname, '../../../resource/private/view')
        )
    }
};