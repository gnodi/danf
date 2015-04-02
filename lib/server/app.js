'use strict';

/**
 * Module dependencies.
 */
require('../common/init');

var cluster = require('cluster'),
    domain = require('domain'),
    os = require('os'),
    fs = require('fs'),
    http = require('http'),
    exec = require('child_process').exec,
    express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    build = require('../../build'),
    Framework = require('../common/framework/framework'),
    Initializer = require('../common/framework/initializer'),
    InitializerServer = require('./framework/initializer')
;

/**
 * Expose `createApplication`.
 */
module.exports = createApplication;

/**
 * Create an express application and wrap it
 * in a danf application.
 *
 * @param {object|string} serverConfiguration The danf server configuration.
 * @param {string} clientConfiguration The danf client configuration.
 * @param {object} serverContext The server application context.
 * @param {object} clientContext The client application context.
 * @param {function} callback An optional callback to process before to listen to requests.
 * @api public
 */
function createApplication(serverConfiguration, clientConfiguration, serverContext, clientContext, callback) {
    Object.checkType(serverConfiguration, 'object|string');
    Object.checkType(clientConfiguration, 'string');

    if ('string' === typeof serverConfiguration) {
        serverConfiguration = require(fs.realpathSync(serverConfiguration));
    }

    // Handle context.
    var args = process.argv.slice(2),
        formatContext = function(context, defaultContext) {
            if (!context) {
                context = defaultContext;
            } else {
                Object.checkType(context, 'object');

                for (var name in defaultContext) {
                    if (undefined === context[name]) {
                        context[name] = defaultContext[name];
                    }
                }
            }

            for (var arg in args) {
                var argParts = args.indexOf('=');

                if (argParts.length >= 2) {
                    var name = argParts.shift(),
                        value = argParts.join('')
                    ;

                    context[name] = value;
                }
            }

            return context;
        }
    ;

    var context = formatContext(
            serverContext,
            {
                app: 'main',
                environment: 'dev',
                debug: true,
                listen: true,
                port: 3080,
                workers: 1,
                secret: 'bad secret'
            }
        ),
        clientContext = formatContext(
            clientContext,
            {
                app: 'main',
                environment: 'dev',
                debug: true,
                modules: [
                    'manipulation',
                    'configuration',
                    'object',
                    'dependency-injection',
                    'event',
                    'http',
                    'vendor',
                    'ajax-app'
                ]
            }
        )
    ;

    // Find common path between the app and danf.
    var danfMainAbsolutePath = require.resolve('../client/main'),
        appMainAbsolutePath = fs.realpathSync(clientConfiguration),
        directorySeparator = -1 !== appMainAbsolutePath.indexOf('/') ? '/' : '\\',
        pathParts = appMainAbsolutePath.split(directorySeparator),
        commonPath = appMainAbsolutePath
    ;

    while (pathParts.pop()) {
        if (-1 !== danfMainAbsolutePath.indexOf(commonPath)) {
            break;
        }

        commonPath = pathParts.join(directorySeparator);
    }

    if (undefined === context.clientMainPath) {
        context.clientMainPath = '{0}/.bin/main.js'.format(commonPath).replace(/\\/g, '/')
    }

    // Process master.
    if (cluster.isMaster && 'test' !== context.environment) {
        var cpuCount = require('os').cpus().length,
            workersNumber = context.workers >= 1
                ? context.workers
                : cpuCount + context.workers
        ;

        workersNumber = Math.min(Math.max(workersNumber, 1), cpuCount);

        if (!context.silent) {
            console.log('Building client js file...');
        }

        var hasShell = -1 === os.platform().indexOf('win'),
            command = hasShell
                ? 'node ' + fs.realpathSync(__dirname + '/../../node_modules/.bin/gnucki-r.js')
                : fs.realpathSync(__dirname + '/../../node_modules/.bin/gnucki-r.js.cmd')
            ,
            optimize = clientContext.debug ? 'none' : 'uglify2'
        ;

        var danfMainRelativePath = danfMainAbsolutePath.slice(commonPath.length + 1, -3),
            appMainRelativePath = appMainAbsolutePath.slice(commonPath.length + 1, -3),
            danfRelativePath = danfMainRelativePath.slice(0, -(build.name.length)),
            relativizePath = function(path) {
                if ('.js' !== path.slice(-3)) {
                    path += '.js';
                }

                var relativizedPath;

                try {
                    relativizedPath = require.resolve(path);
                } catch (error) {}

                if (null == relativizedPath) {
                    relativizedPath = fs.realpathSync(path);
                }

                return relativizedPath.slice(commonPath.length + 1, -3).replace(/\\/g, '/');
            }
        ;

        if (!danfRelativePath) {
            danfRelativePath = '../../';
        }

        command += ' -o' +
            ' baseUrl="' + commonPath.replace(/\\/g, '/') +
            '" name="' + danfMainRelativePath.replace(/\\/g, '/') +
            '" out="' + context.clientMainPath +
            '" paths._app="' + appMainRelativePath.replace(/\\/g, '/') +
            '" include=_app' +
            ' optimize=' + optimize +
            ' absolutise=true' +
            ' cjsTranslate=true'
        ;

        for (var key in build.paths) {
            command += ' paths.{0}="{1}"'.format(
                key,
                0 === build.paths[key].indexOf('lib')
                    ? relativizePath(danfRelativePath + build.paths[key])
                    : relativizePath(build.paths[key])
            );
        }

        for (var key in build.map) {
            for (var embeddedKey in build.map[key]) {
                command += ' map.{0}.{1}="{2}"'.format(
                    0 === key.indexOf('lib')
                        ? relativizePath(danfRelativePath + key)
                        : key
                    ,
                    0 === embeddedKey.indexOf('lib')
                        ? relativizePath(danfRelativePath + embeddedKey)
                        : embeddedKey
                    ,
                    0 === build.map[key][embeddedKey].indexOf('lib')
                        ? relativizePath(danfRelativePath + build.map[key][embeddedKey])
                        : build.map[key][embeddedKey]
                );
            }
        }

        exec(command, function (error, stdout, stderr) {
            if (error) {
                throw error;
            } else if (stderr) {
                throw new Error(error);
            } else if (-1 !== stdout.indexOf('Error:')) {
                throw new Error(stdout);
            } else {
                for (var i = 0; i < workersNumber; i++) {
                    cluster.fork();
                }
            }
        });
    // Process workers.
    } else {
        if (cluster.worker) {
            var workerId = cluster.worker.id;

            context.worker = workerId;

            if (!context.silent) {
                console.log('Worker "{0}" processing.'.format(workerId));
            }
        }

        var app = express();

        // Use.
        app.useBeforeRouting = function () {
            this.use(function(req, res, next) {
                var dom = domain.create();

                domain.active = dom;
                dom.add(req);
                dom.add(res);

                dom.on('error', function(err) {
                    req.next(err);
                });
                res.on('end', function() {
                   dom.dispose();
                });

                dom.run(next);
            });

            this.use(cookieParser());
            this.use(session({
                secret: context.secret,
                cookie: {},
                resave: true,
                saveUninitialized: true
            }));
        };
        app.useAfterRouting = function () {
        };

        // Create.
        app.create = function() {
            this.context = context;
            this.clientContext = clientContext;

            this.useBeforeRouting();

            // Build framework.
            var framework = new Framework(),
                initializer = new Initializer(),
                initializerServer = new InitializerServer()
            ;

            framework.addInitializer(initializer);
            framework.addInitializer(initializerServer);
            framework.set('danf:app', this);
            framework.build(serverConfiguration, context);

            this.servicesContainer = framework.objectsContainer;

            this.useAfterRouting();

            if (callback) {
                Object.checkType(callback, 'function');

                callback(this);
            }

            if (context.listen) {
                this.listen(context.silent);
            }
        };

        // Override listen.
        app.listen = function(silent) {
            var server = http.createServer(this)

            server.listen(this.context.port);

            if (!silent) {
                console.log('Server running at "http://127.0.0.1:{0}/"'.format(this.context.port));
            }
        };

        /**
         * Get/set the context of the application.
         *
         * @return {object}
         * @api public
         */
        Object.defineProperty(app, 'context', {
            get: function() { return this._context; },
            set: function(context) { this._context = context; }
        });

        /**
         * Get/set the client context of the application.
         *
         * @return {object}
         * @api public
         */
        Object.defineProperty(app, 'clientContext', {
            get: function() { return this._clientContext; },
            set: function(clientContext) { this._clientContext = clientContext; }
        });

        /**
         * Get/set the services container.
         *
         * @return {object}
         * @api public
         */
        Object.defineProperty(app, 'servicesContainer', {
            get: function() { return this._servicesContainer; },
            set: function(servicesContainer) { this._servicesContainer = servicesContainer; }
        });

        app.create();

        return app;
    }

    cluster.on('exit', function (worker) {
        if (!context.silent) {
            console.log('Worker "{0}" died.'.format(worker.id));
        }

        cluster.fork();
    });
};