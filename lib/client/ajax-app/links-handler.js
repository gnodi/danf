'use strict';

/**
 * Expose `LinksHandler`.
 */
module.exports = LinksHandler;

/**
 * Initialize a new ajax links handler.
 *
 * @param {function} jquery Jquery.
 * @param {danf:ajaxApp.bodyProvider} bodyProvider The body provider.
 * @param {danf:ajaxApp.readyTrigger} readyTrigger The ready trigger.
 * @param {danf:ajaxApp.historyHandler} historyHandler The history handler.
 */
function LinksHandler(jquery, bodyProvider, readyTrigger, historyHandler) {
    if (jquery) {
        this.jquery = jquery;
    }
    if (bodyProvider) {
        this.bodyProvider = bodyProvider;
    }
    if (readyTrigger) {
        this.readyTrigger = readyTrigger;
    }
    if (historyHandler) {
        this.historyHandler = historyHandler;
    }
}

LinksHandler.defineImplementedInterfaces(['danf:ajaxApp.linksHandler']);

LinksHandler.defineDependency('_jquery', 'function');
LinksHandler.defineDependency('_bodyProvider', 'danf:ajaxApp.bodyProvider');
LinksHandler.defineDependency('_readyTrigger', 'danf:ajaxApp.readyTrigger');
LinksHandler.defineDependency('_historyHandler', 'danf:ajaxApp.historyHandler');

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(LinksHandler.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Set the body provider.
 *
 * @param {danf:ajaxApp.bodyProvider}
 * @api public
 */
Object.defineProperty(LinksHandler.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * Set the ready trigger.
 *
 * @param {danf:ajaxApp.readyTrigger}
 * @api public
 */
Object.defineProperty(LinksHandler.prototype, 'readyTrigger', {
    set: function(readyTrigger) { this._readyTrigger = readyTrigger; }
});

/**
 * Set the history handler.
 *
 * @param {danf:ajaxApp.historyHandler}
 * @api public
 */
Object.defineProperty(LinksHandler.prototype, 'historyHandler', {
    set: function(historyHandler) { this._historyHandler = historyHandler; }
});

/**
 * @interface {danf:ajaxApp.linksHandler}
 */
LinksHandler.prototype.load = function(scope) {
    var $ = this._jquery,
        self = this,
        scope = scope || $(document)
    ;

    scope.find('a.ajax-autoload').hide().each(function() {
        var link = $(this),
            settings = buildSettings.call(self, link)
        ;

        settings.success = function(data) {
            var element = $(data),
                elem = self._bodyProvider.provide(element),
                content = elem === element ? elem : elem.children()
            ;

            // Integrate the returned data.
            if ('a' === link.get(0).nodeName.toLowerCase()) {
                var wrapper = $(document.createElement('div'));

                wrapper.addClass(link.attr('class'));
                wrapper.css('display', 'inline');
                wrapper.data(link.data());
                wrapper.wrapInner(content);

                link.replaceWith(wrapper);
                link = wrapper;
            } else {
                link.empty();
                link.wrapInner(content);
            }

            // Trigger an ajax ready event with the new integrated
            // data as scope.
            self._readyTrigger.trigger({scope: link.parent()});
        };

        settings.complete = function(data) {
        // Reload the content of the link if defined.
            if (settings.reloadTime && $.contains(document.documentElement, link.get(0))) {
                setTimeout(
                    function() {
                        $.ajax(settings);
                    },
                    settings.reloadTime * 1000
                );
            }
        };

        $.ajax(settings);
    });
}

/**
 * @interface {danf:ajaxApp.linksHandler}
 */
LinksHandler.prototype.follow = function(link) {
    var $ = this._jquery,
        self = this,
        settings = buildSettings.call(this, $(link))
    ;

    settings.success = function(data) {
        var body = self._bodyProvider.provide(),
            element = $(data),
            elem = self._bodyProvider.provide(element),
            content = elem === element ? elem : elem.children()
        ;

        // Handle history states.
        self._historyHandler.add({content: elem.html()}, settings.url);

        // Replace the body.
        body.empty();
        body.wrapInner(content);

        // Trigger an ajax ready event with the new integrated
        // data as scope.
        self._readyTrigger.trigger({scope: content.parent()});
    };

    settings.complete = function(data) {
        // Reload the content of the link if defined.
        if (settings.reloadTime && $.contains(document.documentElement, link.get(0))) {
            setTimeout(
                function() {
                    $.ajax(settings);
                },
                settings.reloadTime * 1000
            );
        }
    };

    $.ajax(settings);
}

/**
 * Build the settings of the ajax request.
 *
 * @param {jquery} link The link element.
 * @return {object} The settings for the ajax request.
 */
var buildSettings = function(link) {
    var $ = this._jquery,
        self = this,
        settings = link.data('ajax') || {}
    ;

    settings.url = link.attr('href')
    settings.dataType = 'html';
    settings.type = 'GET';

    link.data('ajax', settings);

    settings.error = function(jqXHR, textStatus, errorThrown) {
        console.log('{0}: {1}'.format(textStatus, errorThrown));
    };

    return settings;
}