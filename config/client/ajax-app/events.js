'use strict';

define(function(require) {
    return {
        dom: {
            'danf:ajaxApp.ready': {
                event: 'ready',
                sequences: ['danf:ajaxApp.process']
            },
            'danf:ajaxApp.ajaxReady': {
                event: 'ajaxReady',
                sequences: ['danf:ajaxApp.processAjax']
            },
            'danf:ajaxApp.click.link': {
                event: 'click',
                selector: 'a.ajax',
                preventDefault: true,
                stopPropagation: true,
                sequences: ['danf:ajaxApp.followAjaxLink']
            },
            'danf:ajaxApp.click.submit': {
                event: 'click',
                selector: 'form.ajax :submit',
                preventDefault: true,
                stopPropagation: true,
                sequences: ['danf:ajaxApp.submitForm']
            },
            'danf:ajaxApp.popstate': {
                event: 'popstate',
                selector: 'window',
                sequences: ['danf:ajaxApp.navigate']
            }
        }
    };
});