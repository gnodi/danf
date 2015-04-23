'use strict';

module.exports = {
    notifier: {
        children: {
            dom: {
                class: 'danf:event.notifier.dom',
                properties: {
                    jquery: '#danf:vendor.jquery#'
                }
            }
        }
    }
};