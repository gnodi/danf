'use strict';

define(function(require) {
    /**
     * Initialize a new body provider.
     *
     * @param {function} jquery JQuery.
     */
    function BodyProvider(jquery) {
        if (jquery) {
            this.jquery = jquery;
        }
    }

    BodyProvider.defineImplementedInterfaces(['danf:ajaxApp.bodyProvider']);

    BodyProvider.defineDependency('_jquery', 'function');

    /**
     * Set JQuery.
     *
     * @param {function}
     * @api public
     */
    Object.defineProperty(BodyProvider.prototype, 'jquery', {
        set: function(jquery) { this._jquery = jquery; }
    });

    /**
     * @interface {danf:ajaxApp.bodyProvider}
     */
    BodyProvider.prototype.provide = function(dom) {
        var $ = this._jquery,
            isDocument = dom ? false : true,
            scope = isDocument ? $(document.documentElement) : dom
        ;

        if (!isDocument) {
            var wrapper = $(document.createElement('div'));

            wrapper.wrapInner(dom);
            scope = wrapper;
        }

        var body = scope.find('#ajax-body');

        if (0 === body.length) {
            if (isDocument) {
                body = $(document.body);
            } else {
                body = dom;
            }
        }

        return body;
    }

    /**
     * Expose `BodyProvider`.
     */
    return BodyProvider;
});