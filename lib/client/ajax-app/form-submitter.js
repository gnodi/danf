'use strict';

/**
 * Expose `FormsHandler`.
 */
module.exports = FormsHandler;

/**
 * Initialize a new ajax forms handler.
 */
function FormsHandler() {
}

FormsHandler.defineImplementedInterfaces(['danf:ajaxApp.formsHandler']);

FormsHandler.defineDependency('_jquery', 'function');
FormsHandler.defineDependency('_bodyProvider', 'danf:ajaxApp.bodyProvider');
FormsHandler.defineDependency('_readyTrigger', 'danf:ajaxApp.readyTrigger');
FormsHandler.defineDependency('_historyHandler', 'danf:ajaxApp.historyHandler');
FormsHandler.defineDependency('_eventTrigger', 'danf:event.eventTrigger');
FormsHandler.defineDependency('_logger', 'danf:logging.logger');

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(FormsHandler.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Set the body provider.
 *
 * @param {danf:ajaxApp.bodyProvider}
 * @api public
 */
Object.defineProperty(FormsHandler.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * Set the ready trigger.
 *
 * @param {danf:ajaxApp.readyTrigger}
 * @api public
 */
Object.defineProperty(FormsHandler.prototype, 'readyTrigger', {
    set: function(readyTrigger) { this._readyTrigger = readyTrigger; }
});

/**
 * Set the history handler.
 *
 * @param {danf:ajaxApp.historyHandler}
 * @api public
 */
Object.defineProperty(FormsHandler.prototype, 'historyHandler', {
    set: function(historyHandler) { this._historyHandler = historyHandler; }
});

/**
 * Set the event trigger.
 *
 * @param {danf.event.eventTrigger}
 * @api public
 */
Object.defineProperty(FormsHandler.prototype, 'eventTrigger', {
    set: function(eventTrigger) { this._eventTrigger = eventTrigger; }
});

/**
 * Set the logger.
 *
 * @param {danf:logging.logger}
 * @api public
 */
Object.defineProperty(FormsHandler.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * @interface {danf:ajaxApp.formsHandler}
 */
FormsHandler.prototype.submit = function(submitter) {
    var $ = this._jquery,
        self = this,
        submit = $(submitter),
        form = submit.parents('form.ajax'),
        settings = buildSettings.call(this, form)
    ;

    var method = form.attr('method'),
        url = form.attr('action')
    ;

    if (this._router.find(url, method)) {
        this._router.follow(url, method);
    }


    settings.success = function(data) {
        var submitSettings = submit.data('ajax') || {},
            history = data,
            element,
            elem,
            content
        ;

        if ('html' === settings.dataType) {
            var submitSettings = submit.data('ajax') || {},
                element = $(data),
                elem = self._bodyProvider.provide(element),
                history = elem.html(),
                content = elem === element ? elem : elem.children()
            ;

            if (!submitSettings.preventDefault) {
                var body = self._bodyProvider.provide();

                // Replace the body.
                body.empty();
                body.wrapInner(content);
            }
        }

        // Handle history states for requests GET.
        if (!submitSettings.preventHistory && 'GET' === settings.type) {
            var url = settings.url,
                querystring = settings.data
            ;

            if (querystring) {
                if (-1 === url.indexOf('?')) {
                    url += '?';
                } else {
                    url += '&';
                }

                url += querystring;
            }

            self._historyHandler.add({content: history}, url);
        }

        if ('html' === settings.dataType && !submitSettings.preventDefault) {
            // Trigger an ajax ready event with the new integrated
            // data as scope.
            self._readyTrigger.trigger({scope: content.parent()});
        }

        if (submitSettings.event) {
            self._eventTrigger.trigger(
                'event',
                'danf:form.{0}'.format(submitSettings.event),
                self,
                {
                    data: data,
                    form: form,
                    input: form.serialize(),
                    submitter: submit
                }
            );
        }
    };

    $.ajax(settings);
}

/**
 * Build the settings of the ajax request.
 *
 * @param {jquery} form The form element.
 * @return {object} The settings for the ajax request.
 */
var buildSettings = function(form) {
    var $ = this._jquery,
        self = this,
        settings = form.data('ajax') || {}
    ;

    settings.url = form.attr('action')
    if (null == settings.dataType) {
        settings.dataType = 'html';
    }

    settings.type = method ? form.attr('method').toUpperCase() : 'POST';

    form.data('ajax', settings);

    settings.data = form.serialize();

    settings.error = function(jqXHR, textStatus, errorThrown) {
        self._logger.log('<<error>>{0}: {1}'.format(textStatus, errorThrown));
    };

    return settings;
}