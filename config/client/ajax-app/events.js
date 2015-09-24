'use strict';

module.exports = {
    dom: {
        'danf:ajaxApp.ready': {
            event: 'ready',
            sequences: [
                {
                    name: 'danf:ajaxApp.process'
                }
            ]
        },
        'danf:ajaxApp.click.link': {
            event: 'click',
            selector: 'a.ajax',
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
                    name: 'danf:ajaxApp.navigate'
                }
            ]
        }
    }
};