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
 * @param {danf:manipulation.bodyProvider}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * Set the history handler.
 *
 * @param {danf:manipulation.history}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'history', {
    set: function(history) { this._history = history; }
});

/**
 * Set the ready processor.
 *
 * @param {danf:manipulation.readyProcessor}
 * @api public
 */
Object.defineProperty(LinkFollower.prototype, 'readyProcessor', {
    set: function(readyProcessor) { this._readyProcessor = readyProcessor; }
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
    var $ = this._jquery,
        self = this,
        link = $(link),
        settings = link.data('ajax') || {},
        target = settings.target ? $(settings.target) : null,
        autoload = null != settings.autoload,
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
    var wrapper = $(document.createElement('div'));

    wrapper.wrapInner(contentBody);
    if (target == body) {
        target.empty().append(wrapper);
    } else {
        target.replaceWith(wrapper);
    }
    this._readyProcessor.process(wrapper);
    contentBody.data('ajax', settings);
    contentBody.unwrap();

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

        newEvent.target = contentBody;

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