'use strict';

module.exports = {
    renderer: {
        class: 'danf:rendering.renderer',
        properties: {
            referenceResolver: '#danf:manipulation.referenceResolver#',
            formatRenderers: '&danf:rendering.formatRenderer&'
        }
    },
    formatRenderer: {
        tags: ['danf:rendering.formatRenderer'],
        children: {
            text: {
                class: 'danf:rendering.formatRenderer.text',
                properties: {
                    referenceResolver: '#danf:manipulation.referenceResolver#'
                }
            },
            json: {
                class: 'danf:rendering.formatRenderer.json'
            },
            html: {
                class: 'danf:rendering.formatRenderer.html'
            }
        }
    }
};