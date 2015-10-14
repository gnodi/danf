'use strict';

var utils = require('../../../lib/common/utils'),
    SectionProcessor = require('../../../lib/common/configuration/section-processor')
;

module.exports = GlobalSectionProcessor;

function GlobalSectionProcessor(name, configurationResolver, referenceResolver) {
    SectionProcessor.call(this);

    this.name = name;
    this.contract = null;
    this.configurationResolver = configurationResolver;
    this.referenceResolver = referenceResolver;

    this.contract = {
    	value: {
            type: 'number',
            default: 1
        }
    };
}

utils.extend(SectionProcessor, GlobalSectionProcessor);