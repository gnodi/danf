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
LinkFollower.defineDependency('_bodyProvider', 'danf:manipulation.bodyProvider');
LinkFollower.defineDependency('_history', 'danf:manipulation.history');
LinkFollower.defineDependency('_readyProcessor', 'danf:manipulation.readyProcessor');
LinkFollower.defineDependency('_router', 'danf:http.router');
LinkFollower.defineDependency('_reloadingSequence', 'danf:event.sequence');

/**
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Body provider.
 *
 * @var {danf:manipulation.bodyProvider}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * History handler.
 *
 * @var {danf:manipulation.history}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'history', {
    set: function(history) { this._history = history; }
});

/**
 * Ready processor.
 *
 * @var {danf:manipulation.readyProcessor}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'readyProcessor', {
    set: function(readyProcessor) { this._readyProcessor = readyProcessor; }
});

/**
 * Router.
 *
 * @var {danf.http.router}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'router', {
    set: function(router) { this._router = router; }
});

/**
 * Reloading sequence.
 *
 * @var {danf:event.sequence}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'reloadingSequence', {
    set: function(reloadingSequence) { this._reloadingSequence = reloadingSequence; }
});

/**
 * @interface {danf:ajaxApp.formSubmitter}
 */
LinkFollower.prototype.follow = function(link) {
    var $ = this._jquery,
        link = $(link)
    ;

    // Handle case where the link is not in the DOM anymore.
    if (0 === link.length || !$.contains(document.documentElement, link.get(0))) {
        return;
    }

    var method = 'GET',
        url = link.attr('href'),
        settings = link.data('ajax') || {}
    ;

    if (null == url) {
        url = settings.url;
    } else {
        settings.url = url;
        link.data('ajax', settings);
    }

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
LinkFollower.prototype.write = function(content, url, link, event) {
    var $ = this._jquery;

    // Handle case where the link is not in the DOM anymore.
    if (!$.contains(document.documentElement, link)) {
        return;
    }

    var self = this,
        link = $(link),
        settings = link.data('ajax') || {},
        target = settings.target ? $(settings.target) : null,
        autoload = null != settings.autoload && false !== settings.autoload,
        body = this._bodyProvider.provide(),
        contentBody = this._bodyProvider.provide($(content)).children()
    ;

    if (null == target) {
        target = autoload ? link : body;
    }

    // Handle case where the target is not in the DOM anymore.
    if (0 === target.length || !$.contains(document.documentElement, target.get(0))) {
        return;
    }

    // Display content in the page.
    var wrapper = $(document.createElement('div')),
        replace = settings.replace
    ;

    wrapper.wrapInner(contentBody);
    target.empty();

    if (null == replace || true === replace) {
        if (target == link) {
            replace = 'replaceWith'
        } else {
            replace = 'append'
        }
    }

    if (replace) {
        target[replace](wrapper);
        contentBody.data('ajax', settings);
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

    // Set reload mechanism.
    if (autoload && settings.autoload) {
        var newEvent = {};

        for (var key in event) {
            newEvent[key] = event[key];
        }

        newEvent.target = contentBody.get(0);

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