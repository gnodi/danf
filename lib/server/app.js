'use strict';

/**
 * Module dependencies.
 */
require('../common/init');

var cluster = require('cluster'),
    domain = require('domain'),
    os = require('os'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    exec = require('child_process').exec,
    express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    build = require('../../build'),
    chalk = require('chalk'),
    Logger = require('../common/logging/logger'),
    Framework = require('../common/framework/framework'),
    Initializer = require('../common/framework/initializer'),
    InitializerServer = require('./framework/initializer')
;

var logger = new Logger();

logger.chalk = chalk;

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
 */
function createApplication(serverConfiguration, clientConfiguration, serverContext, clientContext, callback) {
    Object.checkType(serverConfiguration, 'object|string');
    Object.checkType(clientConfiguration, 'string|null');

    // Handle client configuration retreiving.
    if (null == clientConfiguration) {
        clientConfiguration = path.join(__dirname, '/../client/danf.js');
    }

    clientConfiguration = fs.realpathSync(clientConfiguration);

    if ('auto' === clientConfiguration) {
        clientConfiguration = buildClientConfiguration(clientConfiguration);
    }

    // Handle server configuration retreiving.
    if ('string' === typeof serverConfiguration) {
        serverConfiguration = fs.realpathSync(serverConfiguration);

        if ('auto' === serverConfiguration) {
            serverConfiguration = buildServerConfiguration(serverConfiguration);
        } else {
            serverConfiguration = require(serverConfiguration);
        }
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

    logger.verbosity = context.verbosity;

    // Find common path between the app and danf.
    var danfPath = fs.realpathSync(path.join(__dirname, '/../..')),
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
        context.clientMainPath = path.join(commonPath, '.bin').replace(/\\/g, '/')
    }

    // Process master.
    if (cluster.isMaster && 'test' !== context.environment) {
        var cpuCount = require('os').cpus().length,
            workersNumber = context.workers >= 1
                ? context.workers
                : cpuCount + context.workers
        ;

        workersNumber = Math.min(Math.max(workersNumber, 1), cpuCount);

        logger.log('<<yellow>>Building client JS files...', 1);

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
            buildConfigurations = [],
            resolvedPaths = resolvePaths(path.dirname(appMainAbsolutePath), path.join(commonPath, danfRelativePath));
        ;

        commonPath = commonPath.replace(/\\/g, '/');
        danfMainRelativePath = danfMainRelativePath.replace(/\\/g, '/');
        appMainRelativePath = appMainRelativePath.replace(/\\/g, '/');

        // Set build configuration for danf client JS file.
        var buildConfiguration = {
                baseUrl: commonPath,
                name: danfMainRelativePath,
                out: path.join(context.clientMainPath, 'danf.js'),
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
            out: path.join(context.clientMainPath, 'require.js'),
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
            out: path.join(context.clientMainPath, 'jquery.js'),
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
            out: path.join(context.clientMainPath, 'init.js'),
            optimize: optimize,
            absolutise: true
        };

        buildConfigurations.push(buildConfiguration);

        // Set build configuration for app client JS file.
        buildConfiguration = {
            baseUrl: commonPath,
            name: appMainRelativePath,
            out: path.join(context.clientMainPath, 'app.js'),
            optimize: optimize,
            absolutise: true,
            cjsTranslate: true
        };

        buildConfiguration.paths = resolvedPaths;
        buildConfigurations.push(buildConfiguration);

        // Set build configuration for config client JS file.
        buildConfiguration = {
            map: {
                '*': {
                    _app: appMainRelativePath
                }
            },
            out: path.join(context.clientMainPath, 'config.js')
        };

        buildConfiguration.paths = resolvedPaths;
        buildConfigurations.push(buildConfiguration);

        // Build client JS and create forks to process requests.
        buildClientJs(buildConfigurations, function () {
            for (var i = 0; i < workersNumber; i++) {
                cluster.fork();
            }
        });
    // Process workers.
    } else {
        if (cluster.worker) {
            var workerId = cluster.worker.id;

            context.worker = workerId;
            logger.log('<<green>>Worker <<bold>>{0}<</bold>> processing.'.format(workerId), 1);
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
                this.listen();
            }
        };

        // Override listen.
        app.listen = function() {
            var server = http.createServer(this)

            server.listen(this.context.port);
            logger.log('<<yellow>>Server running at <<bold>>http://127.0.0.1:{0}/<</bold>>'.format(this.context.port), 1);
        };

        /**
         * Context of the application.
         *
         * @var {object}
         * @api public
         */
        Object.defineProperty(app, 'context', {
            get: function() { return this._context; },
            set: function(context) { this._context = context; }
        });

        /**
         * Client context of the application.
         *
         * @var {object}
         * @api public
         */
        Object.defineProperty(app, 'clientContext', {
            get: function() { return this._clientContext; },
            set: function(clientContext) { this._clientContext = clientContext; }
        });

        /**
         * Services container.
         *
         * @var {object}
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
        logger.chalk = chalk;
        logger.log('<<red>>Worker <<bold>>{0}<</bold>> died.'.format(worker.id), 1);

        cluster.fork();
    });
};

    /**
     * Build client JS files.
     *
     * @param {array} buildConfigurations The configurations for the files to build.
     * @param {function} callback The callback to execute at the end.
     */
var buildClientJs = function(buildConfigurations, callback) {
        var buildConfiguration = buildConfigurations.shift();

        if (buildConfiguration) {
            var isGeneration = undefined === buildConfiguration.name;

            logger.log(
                '<<yellow>>><</yellow>> {0} ({1})'.format(
                    buildConfiguration.out,
                    !isGeneration ? buildConfiguration.name : '--generated--'
                ),
                1,
                1
            );

            if (isGeneration) {
                var fileContent = 'requirejs.config({0});'.format(
                        JSON.stringify(buildConfiguration)
                    )
                ;

                fs.writeFileSync(buildConfiguration.out, fileContent);

                buildClientJs(buildConfigurations, callback);
            } else {
                var command = '{0} -o{1}'.format(
                        -1 === os.platform().indexOf('win')
                            ? 'node ' + fs.realpathSync(path.join(__dirname, '/../../node_modules/.bin/gnucki-r.js'))
                            : fs.realpathSync(path.join(__dirname, '/../../node_modules/.bin/gnucki-r.js.cmd'))
                        ,
                        buildCommandLine(buildConfiguration)
                    )
                ;

                exec(command, function (error, stdout, stderr) {
                    try {
                        if (stderr) {
                            throw new Error(error);
                        } else if (stdout && -1 !== stdout.indexOf('Error:')) {
                            throw new Error(stdout);
                        } else if (error) {
                            throw error;
                        } else {
                            buildClientJs(buildConfigurations, callback);
                        }
                    } catch (error) {
                        logger.log('<<red>>{0}'.format(error.message));
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
    },

    /**
     * Resolve paths.
     *
     * @param {string} sourcePath The source path.
     * @param {string} excludedPath The excluded path.
     * @return {string_object} The resolved paths.
     */
    resolvePaths = function(sourcePath, excludedPath) {
        var paths = {},
            modulesPath = path.join(sourcePath, 'node_modules')
        ;

        if (path.join(excludedPath, 'node_modules') !== modulesPath) {
            try {
                var modulesDirectory = fs.readdirSync(modulesPath).filter(function(file) {
                        return fs.statSync(path.join(modulesPath, file)).isDirectory();
                    })
                ;

                for (var i = 0; i < modulesDirectory.length; i++) {
                    var directory = modulesDirectory[i],
                        modulesDirectoryPath = path.join(modulesPath, directory)
                    ;

                    if (-1 !== directory.indexOf('.')) {
                        continue;
                    }

                    paths[directory + '.js'] = path.join(modulesDirectoryPath, 'index');
                    paths[directory] = modulesDirectoryPath;

                    // Merge module paths.
                    var modulePaths = resolvePaths(modulesDirectoryPath, excludedPath);

                    for (var name in modulePaths) {
                        if (undefined === paths[name]) {
                            paths[name] = modulePaths[name];
                        }
                    }
                }
            } catch (error) {
                // Handle not existing modules folder.
            }
        }

        return paths;
    },

    /**
     * Build client configuration.
     *
     * @param {string} path The root path.
     *
     * @return {object} The configuration.
     */
    buildClientConfiguration = function(path) {
        var configuration = buildConfiguration(path);

        return configuration;
    },

    /**
     * Build server configuration.
     *
     * @param {string} path The root path.
     *
     * @return {object} The configuration.
     */
    buildServerConfiguration = function(path) {
        var configuration = buildConfiguration(path);

        return configuration;
    }

    /**
     * Build configuration.
     *
     * @param {string} path The root path.
     *
     * @return {object} The configuration.
     */
    buildConfiguration = function(path) {
        var configuration = {},
            directoryItems = fs.readdirSync(modulesPath)
        ;

        for (var i = 0; i < directoryItems.length; i++) {
            var config = configuration,
                name = directoryItems[i],
                keys = name
                    .replace(/-[a-z]/g, function(match) {
                        return match[1].toUpperCase();
                    })
                    .split('.')
                ,
                fullPath = path.join(path, name),
                stat = fs.statSync(fullPath)
            ;

            // Handle case of a structural name.
            if ('' !== keys[0]) {
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];

                    if (keys.length - 1 === j) {
                        if (stat.isDirectory()) {
                            config = buildConfiguration(fullPath);
                        } else if (stat.isFile()) {
                            config = require(fullPath);
                        }
                    } else {
                        config[key] = {};
                        config = config[key];
                    }
                }
            // Handle case of a meaning name.
            } else {
                if (stat.isDirectory()) {
                    config = buildConfiguration(fullPath);
                } else if (stat.isFile()) {
                    config = require(fullPath);
                }
            }
        }

        /*
        // CONFIG:
        events: {
            request: {
                compute: {
                    // ...
                },
                api: {
                    children: {
                        user: {
                            get: {
                                // ...
                            },
                            post: {
                                // ...
                            },
                            children {
                                message: {
                                    children: {
                                        get: {
                                            // ...
                                        }
                                    }
                                }
                            }
                        },
                        topic: {
                            get: {
                                // ...
                            },
                            post: {
                                // ...
                            }
                        },
                        oldTopic: {
                            get: {
                                // ...
                            },
                            post: {
                                // ...
                            }
                        }
                    }
                }
            }
        }

        // DIRECTORIES:
        ->events
            ->request
                compute
                ->api.children
                    ->user
                        .api
                        ->children
                            ->message
                                .
                    topic
                    old-topic
        */


        return configuration;
    }
;