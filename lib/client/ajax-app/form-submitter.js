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
FormSubmitter.defineDependency('_bodyProvider', 'danf:manipulation.bodyProvider');
FormSubmitter.defineDependency('_history', 'danf:manipulation.history');
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
 * Set the body provider.
 *
 * @param {danf:manipulation.bodyProvider}
 * @api public
 */
Object.defineProperty(FormSubmitter.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * Set the history handler.
 *
 * @param {danf:manipulation.history}
 * @api public
 */
Object.defineProperty(FormSubmitter.prototype, 'history', {
    set: function(history) { this._history = history; }
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

    // Handle case where the form is not in the DOM anymore.
    if (0 === form.length || !$.contains(document.documentElement, form.get(0))) {
        return;
    }

    var method = form.attr('method'),
        url = '{0}?{1}'.format(form.attr('action'), form.serialize())
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
FormSubmitter.prototype.write = function(content, url, submitter) {
    var $ = this._jquery,
        submitter = $(submitter),
        form = submitter.closest('form'),
        settings = form.data('ajax') || {},
        body = this._bodyProvider.provide(),
        target = settings.target ? $(settings.target) : body,
        contentBody = this._bodyProvider.provide($(content)).children()
    ;

    // Handle case where the target is not in the DOM anymore.
    if (
        0 === target.length ||
        !$.contains(document.documentElement, target.get(0))
    ) {
        return;
    }

    // Display content in the page.
    var wrapper = $(document.createElement('div')),
        replace = settings.replace
    ;

    wrapper.wrapInner(contentBody);
    target.empty();

    if (null == replace || true === replace) {
        if (target == form) {
            replace = 'replaceWith'
        } else {
            replace = 'append'
        }
    }

    if (replace) {
        target[replace](wrapper);
        this._readyProcessor.process(wrapper);
        contentBody.unwrap();
    }

    // Handle history.
    if (
        (target == body && false !== settings.bookmark) ||
        true === settings.bookmark
    ) {
        this._history.set(url);
    }
}