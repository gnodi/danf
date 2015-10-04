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
FormSubmitter.defineDependency('_readyProcessor', 'danf:manipulation.readyProcessor');
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
 * Set the ready processor.
 *
 * @param {danf:manipulation.readyProcessor}
 * @api public
 */
Object.defineProperty(FormSubmitter.prototype, 'readyProcessor', {
    set: function(readyProcessor) { this._readyProcessor = readyProcessor; }
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
        submitter = $(submitter),
        form = submitter.closest('form')
    ;

    var method = form.attr('method'),
        url = form.attr('action')
    ;

    this._router.follow.__asyncCall(
        this._router,
        '.',
        url,
        method
    );
}

/**
 * @interface {danf:ajaxApp.formSubmitter}
 */
FormSubmitter.prototype.write = function(content, submitter) {
    var $ = this._jquery,
        submitter = $(submitter),
        form = submitter.closest('form'),
        settings = form.data('ajax') || {},
        target = settings.target ? $(settings.target) : form,
        content = $(content);
    ;

    target.replaceWith(content);
    this._readyProcessor.process(content);
}