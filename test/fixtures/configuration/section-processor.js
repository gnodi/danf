'use strict';

var utils = require('../../../lib/utils'),
    SectionProcessor = require('../../../lib/common/configuration/section-processor')
;

module.exports = GlobalSectionProcessor;

function GlobalSectionProcessor(name, configurationResolver, referenceResolver) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver);

    this.contract = {
    	value: {
            type: 'number',
            default: 1
        }
    };
}

utils.extend(SectionProcessor, GlobalSectionProcessor);