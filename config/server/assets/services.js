'use strict';

module.exports = {
    mapper: {
        parent: 'danf:fileSystem.mapper'
    },
    sectionProcessor: {
        parent: 'danf:configuration.sectionProcessor',
        children: {
            assets: {
                class: 'danf:assets.configuration.sectionProcessor.assets',
                properties: {
                    name: 'assets'
                }
            }
        }
    }
};