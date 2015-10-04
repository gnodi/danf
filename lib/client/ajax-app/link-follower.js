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

    var method = 'GET',
        url = link.attr('href'),
        settings = link.data('ajax') || {}
    ;

    if (undefined == url) {
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
LinkFollower.prototype.write = function(content, link, event) {
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
    this._readyProcessor.process(content);

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