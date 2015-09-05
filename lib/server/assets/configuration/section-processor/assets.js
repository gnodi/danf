'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    SectionProcessor = require('../../../../common/configuration/section-processor')
;

/**
 * Expose `Assets`.
 */
module.exports = Assets;

/**
 * Initialize a new section processor Assets for the config.
 */
function Assets() {
    SectionProcessor.call(this);

    this.contract = {
        __any: {},
        type: 'string'
    };
}

utils.extend(SectionProcessor, Assets);