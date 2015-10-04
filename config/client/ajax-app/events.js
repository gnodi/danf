'use strict';

module.exports = {
    dom: {
        'danf:ajaxApp.ready': {
            event: 'ready',
            sequences: [
                {
                    name: 'danf:manipulation.process'
                }
            ]
        },
        'danf:ajaxApp.click.link': {
            event: 'click',
            selector: 'a[data-ajax]',
            preventDefault: true,
            stopPropagation: true,
            sequences: [
                {
                    name: 'danf:ajaxApp.followLink'
                }
            ]
        },
        'danf:ajaxApp.click.submit': {
            event: 'click',
            selector: 'form.ajax :submit',
            preventDefault: true,
            stopPropagation: true,
            sequences: [
                {
                    name: 'danf:ajaxApp.submitForm'
                }
            ]
        },
        'danf:ajaxApp.popstate': {
            event: 'popstate',
            selector: 'window',
            sequences: [
                {
                    name: 'danf:manipulation.navigate'
                }
            ]
        }
    }
};