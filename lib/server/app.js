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
    Object.checkType(clientConfiguration, 'string|null');

    if (null == clientConfiguration) {
        clientConfiguration = __dirname + '/../client/danf.js';
    }

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
                verbosity: 5,
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
                verbosity: 5,
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
    var danfPath = fs.realpathSync(__dirname + '/../..'),
        danfMainAbsolutePath = require.resolve('../client/main'),
        appMainAbsolutePath = fs.realpathSync(clientConfiguration),
        directorySeparator = -1 !== appMainAbsolutePath.indexOf('/') ? '/' : '\\',
        pathParts = appMainAbsolutePath.split(directorySeparator),
        commonPath = appMainAbsolutePath
    ;

    while (pathParts.pop()) {
        if (-1 !== danfPath.indexOf(commonPath)) {
            break;
        }

        commonPath = pathParts.join(directorySeparator);
    }

    if (undefined === context.clientMainPath) {
        context.clientMainPath = '{0}/.bin'.format(commonPath).replace(/\\/g, '/')
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
            console.log('Building client JS files...');
        }

        var optimize = clientContext.debug ? 'none' : 'uglify2',
            danfMainRelativePath = danfMainAbsolutePath.slice(commonPath.length + 1, -3),
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
            },
            buildConfigurations = []
        ;

        commonPath = commonPath.replace(/\\/g, '/');
        danfMainRelativePath = danfMainRelativePath.replace(/\\/g, '/');
        appMainRelativePath = appMainRelativePath.replace(/\\/g, '/');

        // Set build configuration for danf client JS file.
        var buildConfiguration = {
                baseUrl: commonPath,
                name: danfMainRelativePath,
                out: '{0}/{1}'.format(context.clientMainPath, 'danf.js'),
                paths: {
                    jquery: 'empty:'
                },
                map: {},
                optimize: optimize,
                absolutise: true,
                cjsTranslate: true
            },
            paths = buildConfiguration.paths,
            map = buildConfiguration.map
        ;

        if (!danfRelativePath) {
            danfRelativePath = '../../';
        }

        for (var key in build.paths) {
            if (undefined === paths[key]) {
                paths[key] = 0 === build.paths[key].indexOf('lib')
                    ? relativizePath(danfRelativePath + build.paths[key])
                    : relativizePath(build.paths[key])
                ;
            }
        }

        for (var key in build.map) {
            key = 0 === key.indexOf('lib')
                ? relativizePath(danfRelativePath + key)
                : key
            ;

            if (undefined === map[key]) {
                map[key] = build.map[key] = {};
            }

            for (var embeddedKey in build.map[key]) {
                embeddedKey = 0 === embeddedKey.indexOf('lib')
                    ? relativizePath(danfRelativePath + embeddedKey)
                    : embeddedKey
                ;

                map[key][embeddedKey] = 0 === build.map[key][embeddedKey].indexOf('lib')
                    ? relativizePath(danfRelativePath + build.map[key][embeddedKey])
                    : build.map[key][embeddedKey]
                ;
            }
        }

        buildConfigurations.push(buildConfiguration);

        // Set build configuration for require client JS file.
        buildConfiguration = {
            baseUrl: commonPath,
            name: require
                .resolve('requirejs/require')
                .slice(commonPath.length + 1, -3)
                .replace(/\\/g, '/')
            ,
            out: '{0}/{1}'.format(context.clientMainPath, 'require.js'),
            optimize: optimize
        };

        buildConfigurations.push(buildConfiguration);

        // Set build configuration for jquery client JS file.
        buildConfiguration = {
            baseUrl: commonPath,
            name: require
                .resolve('jquery/dist/jquery')
                .slice(commonPath.length + 1, -3)
                .replace(/\\/g, '/')
            ,
            out: '{0}/{1}'.format(context.clientMainPath, 'jquery.js'),
            optimize: optimize
        };

        buildConfigurations.push(buildConfiguration);

        // Set build configuration for init client JS file.
        buildConfiguration = {
            baseUrl: commonPath,
            name: require
                .resolve('../common/init')
                .slice(commonPath.length + 1, -3)
                .replace(/\\/g, '/')
            ,
            out: '{0}/{1}'.format(context.clientMainPath, 'init.js'),
            optimize: optimize,
            absolutise: true
        };

        buildConfigurations.push(buildConfiguration);

        // Set build configuration for app client JS file.
        buildConfiguration = {
            baseUrl: commonPath,
            name: appMainRelativePath,
            out: '{0}/{1}'.format(context.clientMainPath, 'app.js'),
            optimize: optimize,
            absolutise: true,
            cjsTranslate: true
        };

        buildConfigurations.push(buildConfiguration);

        // Set build configuration for config client JS file.
        buildConfiguration = {
            map: {
                '*': {
                    _app: appMainRelativePath
                }
            },
            out: '{0}/{1}'.format(context.clientMainPath, 'config.js')
        };

        buildConfigurations.push(buildConfiguration);

        // Build client JS and create forks to process requests.
        buildClientJs(buildConfigurations, context.silent, function () {
            for (var i = 0; i < workersNumber; i++) {
                cluster.fork();
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

    /**
     * Build client JS files.
     *
     * @param {array} buildConfigurations The configurations for the files to build.
     * @param {function} callback The callback to execute at the end.
     */
var buildClientJs = function(buildConfigurations, silent, callback) {
        var buildConfiguration = buildConfigurations.shift();

        if (buildConfiguration) {
            var isGeneration = undefined === buildConfiguration.name;

            if (!silent) {
                console.log(' > {0} ({1})'.format(
                    buildConfiguration.out,
                    !isGeneration ? buildConfiguration.name : '--generated--'
                ));
            }

            if (isGeneration) {
                var fileContent = 'requirejs.config({0});'.format(
                        JSON.stringify(buildConfiguration)
                    )
                ;

                fs.writeFileSync(buildConfiguration.out, fileContent);

                buildClientJs(buildConfigurations, silent, callback);
            } else {
                var command = '{0} -o{1}'.format(
                        -1 === os.platform().indexOf('win')
                            ? 'node ' + fs.realpathSync(__dirname + '/../../node_modules/.bin/gnucki-r.js')
                            : fs.realpathSync(__dirname + '/../../node_modules/.bin/gnucki-r.js.cmd')
                        ,
                        buildCommandLine(buildConfiguration)
                    )
                ;

                exec(command, function (error, stdout, stderr) {
                    if (error) {
                        throw error;
                    } else if (stderr) {
                        throw new Error(error);
                    } else if (-1 !== stdout.indexOf('Error:')) {
                        throw new Error(stdout);
                    } else {
                        buildClientJs(buildConfigurations, silent, callback);
                    }
                });
            }
        } else {
            callback();
        }
    },

    /**
     * Build command line.
     *
     * @param {array} args The arguments.
     * @param {string} prefix The prefix.
     */
    buildCommandLine = function(args, prefix) {
        var lineArgs = '';

        if (undefined === prefix) {
            prefix = '';
        }

        for (var key in args) {
            var field = prefix ? '{0}.{1}'.format(prefix, key) : key,
                value = args[key]
            ;

            if ('object' === typeof value) {
                lineArgs += '{0}'.format(
                    buildCommandLine(value, field)
                );
            } else {
                if ('boolean' === typeof value) {
                    value = value ? 'true' : 'false';
                } else if ('string' === typeof value && -1 !== value.indexOf(' ')) {
                    value = '"{0}"'.format(value);
                }

                lineArgs += ' {0}={1}'.format(field, value);
            }
        }

        return lineArgs;
    }
;