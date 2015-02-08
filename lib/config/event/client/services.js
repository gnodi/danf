'use strict';

define(function(require) {
    return {
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
});