'use strict';

module.exports = {
    renderer: {
        class: '%danf:rendering.classes.renderer%',
        properties: {
            referenceResolver: '#danf:manipulation.referenceResolver#',
            formatRenderers: '&danf:rendering.formatRenderer&'
        }
    },
    formatRenderer: {
        tags: ['danf:rendering.formatRenderer'],
        children: {
            text: {
                class: '%danf:rendering.classes.formatRenderer.text%',
                properties: {
                    referenceResolver: '#danf:manipulation.referenceResolver#'
                }
            },
            json: {
                class: '%danf:rendering.classes.formatRenderer.json%'
            },
            html: {
                class: '%danf:rendering.classes.formatRenderer.html%'
            }
        }
    }
};