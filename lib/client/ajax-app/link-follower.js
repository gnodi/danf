'use strict';

/**
 * Expose `LinkFollower`.
 */
module.exports = LinkFollower;

/**
 * Initialize a new ajax link follower.
 */
function LinkFollower() {
}

LinkFollower.defineImplementedInterfaces(['danf:ajaxApp.linkFollower']);

LinkFollower.defineDependency('_jquery', 'function');
LinkFollower.defineDependency('_bodyProvider', 'danf:ajaxApp.bodyProvider');
LinkFollower.defineDependency('_readyTrigger', 'danf:ajaxApp.readyTrigger');
LinkFollower.defineDependency('_router', 'danf:http.router');
LinkFollower.defineDependency('_reloadingSequence', 'danf:event.sequence');

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Set the body provider.
 *
 * @param {danf:ajaxApp.bodyProvider}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * Set the ready trigger.
 *
 * @param {danf:ajaxApp.readyTrigger}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'readyTrigger', {
    set: function(readyTrigger) { this._readyTrigger = readyTrigger; }
});

/**
 * Set the router.
 *
 * @param {danf.http.router}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'router', {
    set: function(router) { this._router = router; }
});

/**
 * Set the reloading sequence.
 *
 * @param {danf:event.sequence}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'reloadingSequence', {
    set: function(reloadingSequence) { this._reloadingSequence = reloadingSequence; }
});

/**
 * @interface {danf:ajaxApp.formSubmitter}
 */
FormSubmitter.prototype.follow = function(link) {
    var $ = this._jquery,
        link = $(link)
    ;

    var method = 'GET',
        url = link.attr('href'),
        settings = link.data('ajax') || {},
    ;

    if (undefined == url) {
        url = settings.url;
    } else {
        settings.url = url;
        link.data('ajax', settings);
    }

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
FormSubmitter.prototype.write = function(content, link, event) {
    var $ = this._jquery,
        self = this,
        link = $(link),
        settings = link.data('ajax') || {},
        target = settings.target ? $(settings.target) : null,
        content = $(content),
        autoload = null != settings.autoload
    ;

    if (null == target) {
        target = autoload ? link : this._bodyProvider.provide();
    }

    content.data('ajax', settings);
    target.replaceWith(content);
    this._readyTrigger.trigger(content);

    if (autoload && settings.autoload) {
        var newEvent = {};

        for (var key in event) {
            newEvent[key] = event[key];
        }

        newEvent.currentTarget = content;

        setTimeout(
            function() {
                self._reloadingSequence.execute(
                    {},
                    {event: newEvent},
                    null
                );
            },
            1000 * settings.autoload
        );
    }
}

/**
 * @interface {danf:ajaxApp.linkFollower}
 */
/*LinkFollower.prototype.load = function(scope) {
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
 * @interface {danf:ajaxApp.linkFollower}
 */
/*LinkFollower.prototype.follow = function(link) {
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
/*var buildSettings = function(link) {
    var $ = this._jquery,
        self = this,
        settings = link.data('ajax') || {}
    ;

    settings.url = link.attr('href')
    settings.dataType = 'html';
    settings.type = 'GET';

    link.data('ajax', settings);

    settings.error = function(jqXHR, textStatus, errorThrown) {
        self._logger.log('<<error>>{0}: {1}'.format(textStatus, errorThrown));
    };

    return settings;
}