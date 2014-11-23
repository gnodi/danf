'use strict';

/**
 * Module dependencies.
 */
require('../../init');

var send = require('send'),
    utils = require('connect/lib/utils'),
    parse = utils.parseUrl,
    url = require('url')
;

/**
 * Static file server with the given `root` path.
 *
 * @param {object} mapper A mapper for paths.
 * @param {object} options The options.
 * @return {function}
 * @api public
 * @see connect/middleware/static
 */
exports = module.exports = function(mapper, options) {
    options = options || {};

    // default redirect
    var redirect = false !== options.redirect;

    return function staticMiddleware(req, res, next) {
        if ('GET' != req.method && 'HEAD' != req.method) {
            return next();
        }

        var originalUrl = url.parse(req.originalUrl),
            path = parse(req).pathname,
            pause = utils.pause(req)
        ;

        if (path == '/' && originalUrl.pathname[originalUrl.pathname.length - 1] != '/') {
            return directory();
        }

        function resume() {
            next();
            pause.resume();
        }

        function directory(name) {
            if (!redirect) {
                return resume();
            }

            var target;

            originalUrl.pathname += '/';
            target = url.format(originalUrl);
            res.statusCode = 303;
            res.setHeader('Location', target);
            res.end('Redirecting to ' + utils.escape(target));
        }

        function error(err) {
            if (404 == err.status) {
                return resume();
            }

            next(err);
        }

        var realPath = '';

        try {
            realPath = mapper.match(path.slice(1));

            send(req, realPath)
                .maxage(options.maxAge || 0)
                .hidden(options.hidden)
                .on('error', error)
                .on('directory', directory)
                .pipe(res)
            ;
        } catch (mappingError) {
            var err = new Error('File not found ({0}).'.format(mappingError.message));
            err.status = 404;

            error(err);
        }
    };
};