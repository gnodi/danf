'use strict';

/**
 * Expose `FormSubmitter`.
 */
module.exports = FormSubmitter;

/**
 * Initialize a new ajax forms handler.
 */
function FormSubmitter() {
}

FormSubmitter.defineImplementedInterfaces(['danf:ajaxApp.formSubmitter']);

FormSubmitter.defineDependency('_jquery', 'function');
FormSubmitter.defineDependency('_readyTrigger', 'danf:ajaxApp.readyTrigger');
FormSubmitter.defineDependency('_router', 'danf:http.router');

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(FormSubmitter.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Set the ready trigger.
 *
 * @param {danf:ajaxApp.readyTrigger}
 * @api public
 */
Object.defineProperty(FormSubmitter.prototype, 'readyTrigger', {
    set: function(readyTrigger) { this._readyTrigger = readyTrigger; }
});

/**
 * Set the router.
 *
 * @param {danf.http.router}
 * @api public
 */
Object.defineProperty(FormSubmitter.prototype, 'router', {
    set: function(router) { this._router = router; }
});

/**
 * @interface {danf:ajaxApp.formSubmitter}
 */
FormSubmitter.prototype.submit = function(submitter) {
    var $ = this._jquery,
        self = this,
        submit = $(submitter),
        form = submit.closest('form')
    ;

    var method = form.attr('method'),
        url = form.attr('action')
    ;

    if (this._router.find(url, method)) {
        this._router.follow.__asyncCall(
            this._router,
            '.',
            url,
            method
        );
    }
}

/**
 * @interface {danf:ajaxApp.formSubmitter}
 */
FormSubmitter.prototype.write = function(content, submitter) {
    var $ = this._jquery,
        self = this,
        submit = $(submitter),
        form = submit.closest('form'),
        settings = form.data('ajax') || {},
        target = settings.target ? settings.target : form,
        content = $(content);
    ;

    target.replaceWith(content);

    this._readyTrigger.trigger(content);
}