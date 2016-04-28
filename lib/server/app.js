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
    net = require('net'),
    http = require('http'),
    exec = require('child_process').exec,
    express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    build = require('../../build'),
    chalk = require('chalk'),
    toSource = require('tosource'),
    rpt = require('read-package-tree'),
    semver = require('semver'),
    utils = require('../common/utils'),
    Logger = require('../common/logging/logger'),
    Framework = require('../common/framework/framework'),
    Initializer = require('../common/framework/initializer'),
    InitializerServer = require('./framework/initializer'),
    versionDiff = {
        major: 0,
        premajor: 1,
        minor: 2,
        preminor: 3,
        patch: 4,
        prepatch: 5,
        prerelease: 6
    }
;

var logger = new Logger();

logger.chalk = chalk;

/**
 * Expose `AppBuilder` instantiator.
 */
module.exports = function(serverConfiguration, clientConfiguration, serverContext, clientContext, callback) {
    return new AppBuilder(serverConfiguration, clientConfiguration, serverContext, clientContext, callback);
};

/**
 * Initialize a new application.
 *
 * @param {object|string} serverConfiguration The danf server configuration.
 * @param {string} clientConfiguration The danf client configuration.
 * @param {object} serverContext The server application context.
 * @param {object} clientContext The client application context.
 */
function AppBuilder(serverConfiguration, clientConfiguration, serverContext, clientContext) {
    Object.checkType(serverConfiguration, 'object|string');
    Object.checkType(clientConfiguration, 'object|string|null');

    this._serverConfiguration = serverConfiguration;
    this._clientConfiguration = clientConfiguration;
    this._originalClientConfiguration = clientConfiguration;
    this._serverContext = serverContext;
    this._clientContext = clientContext;
    this._paths = {};
    this._availableServers = {
        http: {handle: 'HTTP requests', sharable: true, proxy: true},
        socket: {handle: 'socket messages', sharable: true, proxy: true},
        command: {handle: 'commands', sharable: false, proxy: false}
    };

    // Build paths.
    this._paths.danfAbsolute = fs.realpathSync(path.join(__dirname, '/../..'));
    this._paths.danfMainAbsolute = require.resolve('../client/main');
    this._paths.appAbsolute = require.main.filename !== require.resolve('../../main.js') && require.main.filename.indexOf('/gulp/') === -1
        ? path.dirname(require.main.filename)
        : process.cwd()
    ;
    do {
        try {
            fs.statSync(path.join(
                this._paths.appAbsolute,
                'danf.js'
            ));

            break;
        } catch (error) {}
    } while (this._paths.appAbsolute = path.dirname(this._paths.appAbsolute))

    this._paths.appMainAbsolute = fs.realpathSync(
        'string' === typeof clientConfiguration && 'auto' !== clientConfiguration
            ? clientConfiguration
            : path.join(__dirname, '/../client/danf.js')
    );

    var clientBuiltDirectories = ['.built', 'client'];
    this._paths.clientBuilt = serverContext && serverContext.clientBuiltPath
        ? serverContext.clientBuiltPath
        : path.join(
            this._paths.appAbsolute,
            clientBuiltDirectories.join('/')
        )
    ;
    if (!serverContext.clientBuiltPath) {
        var builtDirectory = this._paths.appAbsolute;

        for (var i = 0; i < clientBuiltDirectories.length; i++) {
            builtDirectory = path.join(
                builtDirectory,
                clientBuiltDirectories[i]
            );

            try {
                fs.statSync(builtDirectory);
            } catch(error) {
                fs.mkdirSync(
                    builtDirectory,
                    parseInt('0774', 8)
                );
            }
        }

        // Build empty require file to handle assets mapper behavior.
        var requireFullPath = path.join(builtDirectory, 'require.js');

        try {
            fs.statSync(requireFullPath);
        } catch(error) {
            fs.writeFileSync(requireFullPath, '');
        }
    }

    var pathParts = this._paths.appAbsolute.split(path.sep),
        commonPath = this._paths.appAbsolute
    ;

    while (pathParts.pop()) {
        if (-1 !== this._paths.danfAbsolute.indexOf(commonPath)) {
            break;
        }

        commonPath = pathParts.join(path.sep);
    }

    this._paths.common = commonPath;
    this._paths.danfMainRelative = path.relative(commonPath, this._paths.danfMainAbsolute).replace(/\.js$/, '');
    this._paths.appMainRelative = path.relative(commonPath, this._paths.appMainAbsolute).replace(/\.js$/, '');
    this._paths.danfRelative = path.relative(commonPath, this._paths.danfAbsolute);
    this._paths.appConfigEntry = path.join(path.dirname(this._paths.clientBuilt), 'app-config-entry.js');

    var binPath = '';

    try {
        binPath = path.join(
            this._paths.appAbsolute,
            'node_modules/.bin'
        );
        fs.statSync(path.join(binPath, 'gnucki-r.js'));
    } catch (error) {
        // Handle not existing modules folder.
        if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
            throw error;
        }

        binPath = path.join(__dirname, '../../node_modules/.bin');
    }

    this._paths.bin = binPath;

    // Format contexts.
    var clustered = null !== this._serverContext.cluster;

    this._serverContext = utils.merge(
            {
                app: 'main',
                environment: 'dev',
                debug: true,
                verbosity: 5,
                secret: 'bad secret',
                clientBuiltPath: this._paths.clientBuilt,
                generateDynamicParameters: true,
                cluster: [
                    {
                        listen: ['http', 'socket'],
                        port: 3080,
                        workers: -2
                    },
                    {
                        listen: 'command',
                        port: 3111,
                        workers: 1
                    }
                ]
            },
            this._serverContext
        )
    ;

    if (!clustered) {
        delete this._serverContext.cluster;
    }

    // Format context.
    this._clientContext = utils.merge(
            {
                app: 'main',
                environment: 'dev',
                debug: true,
                verbosity: 5
            },
            this._clientContext
        )
    ;

    // Interpret a cluster.
    this._serverContext.cluster = this.interpretCluster(this._serverContext);

    // Define logging verbosity from context.
    logger.verbosity = this._serverContext.verbosity;

    // Resolve optimization command.
    this._optimizationCommand = -1 === os.platform().indexOf('win')
            ? 'node ' + fs.realpathSync(path.join(this._paths.bin, 'gnucki-r.js'))
            : fs.realpathSync(path.join(this._paths.bin, 'gnucki-r.js.cmd'))
    ;
}

/**
 * Build server.
 *
 * @param {function} done Callback executed at the end of the build.
 * @api public
 */
AppBuilder.prototype.buildServer = function(done) {
    var self = this,
        context = this._serverContext
    ;

    if (cluster.isMaster || !context.cluster) {
        logger.log('<<yellow>><<bold>>Server<</bold>> building...', 1);
    }

    var build = function(dependencies) {
        if ('string' === typeof this._serverConfiguration) {
            // Handle auto configuration building.
            if ('auto' === this._serverConfiguration) {
                if (cluster.isMaster) {
                    this.displayDependencies(dependencies);
                }

                this._serverConfiguration = self.buildSideConfiguration(
                    this._paths.appAbsolute,
                    dependencies,
                    'server'
                );
            // Handle server configuration path.
            } else {
                this._serverConfiguration = require(this._serverConfiguration);
            }

            if (null === this._serverConfiguration.config) {
                this._serverConfiguration.config = {};
            }

            this._serverConfiguration.config.parameters = this.mergeDynamicParameters(
                this._serverConfiguration.config.parameters || {},
                'server'
            );
        }

        // Process master.
        if (context.cluster && cluster.isMaster) {
            var processingWorkers = 0,
                totalWorkers = 0
            ;

            for (var i = 0; i < context.cluster.length; i++) {
                totalWorkers += context.cluster[i].workers;
            }

            // Create workers.
            var buildChunk = function(chunkContext) {
                var workers = [],
                    chunkContext = context.cluster[i],
                    forkWorker = function(context) {
                        var worker = cluster.fork({context: JSON.stringify(context)}),
                            isListening = false
                        ;

                        worker.on('listening', function(address) {
                            isListening = true;

                            logger.log(
                                '<<green>>Worker <<bold>>{0}<</bold>> processing {1} on port <<bold>>{2}<</bold>>...'.format(
                                    worker.id,
                                    self.formatHandledEntities(context.listen),
                                    context.port
                                ),
                                1
                            );
                        });

                        worker.on('exit', function (code, signal) {
                            if (signal) {
                                logger.log(
                                    '<<yellow>>Worker <<bold>>{0}<</bold>> killed ({1}).'.format(
                                        worker.id,
                                        signal
                                    ),
                                    1
                                );
                            } else if (code !== 0) {
                                logger.log(
                                    '<<red>>Worker <<bold>>{0}<</bold>> died ({1}).'.format(
                                        worker.id,
                                        code
                                    ),
                                    1
                                );

                                // Handle case where the server is already listening.
                                if (isListening) {
                                    // Restart the worker.
                                    forkWorker(context);
                                // Handle the case where an error occured during server building.
                                } else {
                                    // Stop the process.
                                    process.exit(1);
                                }
                            } else {
                                logger.log(
                                    '<<green>>Worker <<bold>>{0}<</bold>> stopped.'.format(
                                        worker.id,
                                        signal
                                    ),
                                    1
                                );
                            }
                        });

                        return worker;
                    }
                ;

                for (var j = 0; j < chunkContext.workers; j++) {
                    workers[j] = forkWorker(chunkContext);
                }

                if (chunkContext.proxy) {
                    var getRandomWorkerIndex = function(ip, workersNumber) {
                            return Number('0' + ip.replace(/[abcdef:.]/g, '')) % workersNumber;
                        }
                    ;

                    // Create the proxy server.
                    var server = net.createServer(
                            {pauseOnConnect: true},
                            function(connection) {
                                var index = getRandomWorkerIndex(connection.remoteAddress, chunkContext.workers),
                                    worker = workers[index]
                                ;

                                worker.send('sticky-session:connection', connection);
                            }
                        )
                    ;

                    server.listen(chunkContext.port);
                }
            };

            for (var i = 0; i < context.cluster.length; i++) {
                buildChunk(context.cluster[i]);
            }

            cluster.on('listening', function(worker, address) {
                processingWorkers++;

                if (processingWorkers === totalWorkers) {
                    logListening('', '', self._serverContext.environment, context.cluster);
                }
            });
        } else {
            var appContext = context;

            var app = express();

            if (cluster.worker) {
                var workerId = cluster.worker.id;

                appContext = JSON.parse(cluster.worker.process.env.context);
                appContext.worker = workerId;

                logger.log('<<green>>Worker <<bold>>{0}<</bold>> starting...'.format(workerId), 1);
            }

            // Use.
            app.useBeforeRouting = function () {
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
            app.create = function(context, callback) {
                this.context = context;
                this.clientContext = self._clientContext;

                this.useBeforeRouting();

                // Build framework.
                var framework = new Framework(),
                    initializer = new Initializer(),
                    initializerServer = new InitializerServer(),
                    initFramework = function() {
                        app.servicesContainer = framework.objectsContainer;
                        app.useAfterRouting();

                        app.__asyncFlow = null;

                        callback(app);
                    }
                ;

                framework.addInitializer(initializer);
                framework.addInitializer(initializerServer);
                framework.set('danf:app', this);
                framework.build(self._serverConfiguration, context, logger, initFramework);
            };

            /**
             * Log listening.
             *
             * @param {string} server The server type.
             * @param {number} port The listening port.
             */
            app.logListening = function(server, port) {
                logListening(
                    server,
                    port,
                    this.context.environment,
                    context.cluster
                );
            };

            /**
             * Listen to HTTP requests.
             *
             * @param {function} end An optionnal callback to be called at the end of listening.
             * @api publi
             c
             */
            app.listen = function(end) {
                if (!this.context.listen) {
                    throw new Error('No listening defined.');
                }

                if (
                    'command' === this.context.listen ||
                    'command' === this.context.listen[0]
                ) {
                    this.listenCmd(end);
                } else {
                    this.listenHttp(end);
                }
            };

            /**
             * Listen to HTTP requests.
             *
             * @param {function} end An optionnal callback to be called at the end of listening.
             * @api public
             */
            app.listenHttp = function(end) {
                var server = http.createServer(this),
                    hasProxyServer = this.context.proxy,
                    port = hasProxyServer ? 0 : this.context.port
                ;

                server.on('close', function(error) {
                    logger.log(
                        '<<yellow>>HTTP server listening ended.'.format(
                            port
                        ),
                        1
                    );

                    delete app.server;

                    if (end) {
                        end();
                    }
                });

                var listen = this.context.listen,
                    isSocketServer = 'socket' === listen
                ;

                if (!isSocketServer && 'string' !== typeof listen) {
                    for (var i = 0; i < listen.length; i++) {
                        if ('socket' === listen[i]) {
                            isSocketServer = true;
                            break;
                        }
                    }
                }

                // Add socket handling.
                if (isSocketServer) {
                    app.io = require('socket.io')(server);
                }

                // Listen.
                if (cluster.worker) {
                    server.listen(port, function() {
                        app.emit('listening');
                    });
                } else {
                    server.listen(port, function() {
                        app.emit('listening');
                        app.logListening('HTTP', port);
                    });
                }

                if (hasProxyServer) {
                    // Listen for proxy connection forwarding.
                    process.on('message', function(message, connection) {
                        if ('sticky-session:connection' !== message) {
                            return;
                        }

                        // Emulate a connection event on the server by emitting the
                        // event with the connection given by the proxy server.
                        server.emit('connection', connection);

                        connection.resume();
                    });
                }
            };

            /**
             * Listen to commands.
             *
             * @param {function} end An optionnal callback to be called at the end of listening.
             * @api public
             */
            app.listenCmd = function(end) {
                var server = net.createServer(function(socket) {}),
                    port = this.context.port
                ;

                server.on('error', function(error) {
                    if (error.code == 'EADDRINUSE') {
                        logger.log('<<red>>Port <<bold>>{0}<</bold>> already in use.'.format(port));
                    }

                    if (end) {
                        end();
                    }
                });
                server.on('connection', function(socket) {
                    socket.write(
                        '<<green>>Connected to command server on port <<bold>>{0}<</bold>>.'.format(
                            port
                        )
                    );

                    socket.on('data', function(data) {
                        var line = data.toString('utf8');

                        app.executeCmd(line, function(error) {
                            if (error) {
                                socket.write(
                                    '<<red>>An error occured during command processing ({0}).'.format(
                                        error.message
                                    )
                                );
                            }

                            socket.end('<<green>>Disconnected from command server.');
                        });
                    });
                });
                server.on('close', function(error) {
                    logger.log(
                        '<<yellow>>Command server listening ended.'.format(
                            port
                        ),
                        1
                    );

                    if (end) {
                        end();
                    }
                });

                // Listen.
                server.listen(port, function() {
                    if (!cluster.worker) {
                        app.logListening('Command', port);
                    }

                    app.emit('listening');
                });
            };

            /**
             * Builder used to build the application.
             *
             * @var {object}
             * @api public
             */
            Object.defineProperty(app, 'builder', {
                get: function() { return this._builder; },
                set: function(builder) { this._builder = builder; }
            });

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

            /**
             * Sockect io main listener.
             *
             * @var {object}
             * @api public
             */
            Object.defineProperty(app, 'io', {
                get: function() { return this._io; },
                set: function(io) { this._io = io; }
            });

            /**
             * Execute a command.
             *
             * @param {string} The command line.
             * @param {function} A callback to call after command execution.
             * @api public
             */
            app.executeCmd = function(line, callback) {
                try {
                    var eventsContainer = this._servicesContainer.get('danf:event.eventsContainer'),
                        commandParser = this._servicesContainer.get('danf:command.parser'),
                        commandName = line.split(' ')[0].replace(/^---/, ''),
                        commandEvent = eventsContainer.get(
                            'command',
                            /^(danf:|main:)/.test(commandName) ? commandName : 'main:{0}'.format(commandName)
                        ),
                        command = commandParser.parse(
                            line,
                            commandEvent.hasParameter('options') ? commandEvent.getParameter('options') : null,
                            commandEvent.getParameter('aliases')
                        ),
                        options = command.options
                    ;

                    options.callback = callback;

                    commandEvent.trigger(options);
                } catch (error) {
                    logger.log('<<error>>{0}'.format(error.message), 1);
                    logger.log(
                        '<<grey>>{0}'.format(
                            error.stack.replace(error.message, '')
                        ),
                        2,
                        1,
                        0
                    );

                    callback(error);
                }
            };

            app.builder = self;
            app.create(appContext, done);

            return app;
        }
    };

    this.buildDependencies(this._paths.appAbsolute, build.bind(this));
}

/**
 * Build client.
 *
 * @param {function} done Callback executed at the end of the build.
 * @api public
 */
AppBuilder.prototype.buildClient = function(done) {
    this.buildClientParts(
        ['danf', 'app', 'require', 'jquery', 'init', 'config'],
        done
    );
}

/**
 * Build client parts.
 *
 * @param {string_array} parts The parts names.
 * @param {function} done Callback executed at the end of the build.
 * @api public
 */
AppBuilder.prototype.buildClientParts = function(parts, done) {
    var self = this,
        context = this._clientContext
    ;

    logger.log('<<cyan>><<bold>>Client<</bold>> building...', 1);

    var build = function(dependencies) {
        // Handle auto configuration building.
        if ('auto' === this._originalClientConfiguration) {
            this._clientConfiguration = self.buildSideConfiguration(
                this._paths.appAbsolute,
                dependencies,
                'client'
            );

            if (null === this._clientConfiguration.config) {
                this._clientConfiguration.config = {};
            }

            this._clientConfiguration.config.parameters = this.mergeDynamicParameters(
                this._clientConfiguration.config.parameters || {},
                'client'
            );
        }

        var buildConfigurations = [];

        if (-1 !== parts.indexOf('danf')) {
            buildConfigurations.push(this.clientDanfBuildConfiguration);
        }
        if (-1 !== parts.indexOf('app')) {
            buildConfigurations.push(this.clientAppBuildConfiguration);
        }
        if (-1 !== parts.indexOf('require')) {
            buildConfigurations.push(this.clientRequireBuildConfiguration);
        }
        if (-1 !== parts.indexOf('jquery')) {
            buildConfigurations.push(this.clientJqueryBuildConfiguration);
        }
        if (-1 !== parts.indexOf('init')) {
            buildConfigurations.push(this.clientInitBuildConfiguration);
        }
        if (-1 !== parts.indexOf('config')) {
            buildConfigurations.push(this.clientConfigBuildConfiguration);
        }

        // Build client JS and create forks to process requests.
        self.buildClientFiles(buildConfigurations, function() {
            logger.log('<<cyan>><<bold>>____________________', 1);

            if (done) {
                done();
            }
        });
    };

    this.buildDependencies(this._paths.appAbsolute, build.bind(this));
}

/**
 * Merge app dynamic parameters.
 *
 * @param {object} parameters The parameters.
 * @param {string} sideName The side name.
 * @param {object} parameters The merged parameters.
 * @api protected
 */
AppBuilder.prototype.mergeDynamicParameters = function(parameters, sideName) {
    if ('common' !== sideName) {
        parameters = this.mergeDynamicParameters(
            parameters,
            'common'
        );
    }

    var file = path.join(
            this._paths.appAbsolute,
            'parameters-{0}.js'.format(sideName)
        )
    ;

    try {
        var stats = fs.statSync(file);

        parameters = utils.merge(parameters, require(file), true);
    } catch (error) {
        // Handle not existing common config folder.
        if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
            throw error;
        }

        if (this._serverContext.generateDynamicParameters) {
            var fileContent =
                    "'use strict';\r\n" +
                    "\r\n" +
                    "module.exports = {\r\n" +
                    "};"
            ;

            fs.writeFileSync(
                file,
                fileContent
            );
        }
    }

    return parameters;
}

/**
 * Build configuration for client danf file.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(AppBuilder.prototype, 'clientDanfBuildConfiguration', {
    get: function() {
        var buildConfiguration = {
                baseUrl: this._paths.common,
                name: this._paths.danfMainRelative,
                out: path.join(this._paths.clientBuilt, 'danf.js'),
                paths: {
                    jquery: 'empty:'
                },
                map: {},
                optimize: this._serverContext.debug ? 'none' : 'uglify2',
                absolutise: true,
                cjsTranslate: true
            },
            paths = buildConfiguration.paths,
            map = buildConfiguration.map
        ;

        for (var key in build.paths) {
            if (undefined === paths[key]) {
                paths[key] = 0 === build.paths[key].indexOf('lib')
                    ? this.relativizePath(path.join(this._paths.danfRelative, build.paths[key]))
                    : this.relativizePath(build.paths[key])
                ;
            }
        }

        for (var key in build.map) {
            key = 0 === key.indexOf('lib')
                ? this.relativizePath(path.join(this._paths.danfRelative, key))
                : key
            ;

            if (undefined === map[key]) {
                map[key] = build.map[key] = {};
            }

            for (var embeddedKey in build.map[key]) {
                embeddedKey = 0 === embeddedKey.indexOf('lib')
                    ? this.relativizePath(path.join(this._paths.danfRelative, embeddedKey))
                    : embeddedKey
                ;

                map[key][embeddedKey] = 0 === build.map[key][embeddedKey].indexOf('lib')
                    ? this.relativizePath(path.join(this._paths.danfRelative, build.map[key][embeddedKey]))
                    : build.map[key][embeddedKey]
                ;
            }
        }

        return buildConfiguration;
    }
});

/**
 * Build configuration for client danf file.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(AppBuilder.prototype, 'clientRequireBuildConfiguration', {
    get: function() {
        return {
            baseUrl: this._paths.common.replace(/\\/g, '/'),
            name: require
                .resolve('requirejs/require')
                .slice(this._paths.common.length + 1, -3)
                .replace(/\\/g, '/')
            ,
            out: path.join(this._paths.clientBuilt, 'require.js'),
            optimize: this._serverContext.debug ? 'none' : 'uglify2'
        };
    }
});

/**
 * Build configuration for client jquery file.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(AppBuilder.prototype, 'clientJqueryBuildConfiguration', {
    get: function() {
        return {
            baseUrl: this._paths.common.replace(/\\/g, '/'),
            name: require
                .resolve('jquery/dist/jquery')
                .slice(this._paths.common.length + 1, -3)
                .replace(/\\/g, '/')
            ,
            out: path.join(this._paths.clientBuilt.replace(/\\/g, '/'), 'jquery.js'),
            optimize: this._serverContext.debug ? 'none' : 'uglify2'
        };
    }
});

/**
 * Build configuration for client init file.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(AppBuilder.prototype, 'clientInitBuildConfiguration', {
    get: function() {
        return {
            baseUrl: this._paths.common.replace(/\\/g, '/'),
            name: require
                .resolve('../common/init')
                .slice(this._paths.common.length + 1, -3)
                .replace(/\\/g, '/')
            ,
            out: path.join(this._paths.clientBuilt.replace(/\\/g, '/'), 'init.js'),
            optimize: this._serverContext.debug ? 'none' : 'uglify2',
            absolutise: true
        };
    }
});

/**
 * Build configuration for client app file.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(AppBuilder.prototype, 'clientAppBuildConfiguration', {
    get: function() {
        var self = this,
            appMainRelativePath = this._paths.appMainRelative
        ;

        // Set build configuration for app client JS file.
        if ('object' === typeof this._clientConfiguration) {
            // Generate a temporary config entry file.
            fs.writeFileSync(
                this._paths.appConfigEntry,
                'module.exports = {0};'.format(toSource(this._clientConfiguration).replace(
                    /"require\('([^)]*)'\)"/g,
                    function(match, moduleFullPath) {
                        return 'require(\'{0}\')'.format(
                            moduleFullPath.replace(self._paths.common + '/', '')
                        );
                    }
                ))
            );

            appMainRelativePath = this.relativizePath(this._paths.appConfigEntry);
        }

        var buildConfiguration = {
                baseUrl: this._paths.common.replace(/\\/g, '/'),
                name: appMainRelativePath.replace(/\\/g, '/'),
                out: path.join(this._paths.clientBuilt.replace(/\\/g, '/'), 'app.js'),
                optimize: this._serverContext.debug ? 'none' : 'uglify2',
                absolutise: true,
                cjsTranslate: true
            },
            resolvedPaths = this.resolvePaths(
                path.dirname(this._paths.appAbsolute),
                this._paths.danfAbsolute
            )
        ;

        buildConfiguration.paths = resolvedPaths;

        return buildConfiguration;
    }
});

/**
 * Build configuration for client config file.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(AppBuilder.prototype, 'clientConfigBuildConfiguration', {
    get: function() {
        var appMainRelativePath = 'object' === typeof this._clientConfiguration
                ? this.relativizePath(this._paths.appConfigEntry)
                : this._paths.appMainRelative
        ;

        return {
            map: {
                '*': {
                    _app: appMainRelativePath === '' ? '/' : appMainRelativePath.replace(/\\/g, '/')
                }
            },
            out: path.join(this._paths.clientBuilt.replace(/\\/g, '/'), 'config.js')
        };
    }
});

/**
 * Build client JS files.
 *
 * @param {array} buildConfigurations The configurations for the files to build.
 * @param {function} callback The callback to execute at the end.
 * @api protected
 */
AppBuilder.prototype.buildClientFiles = function(buildConfigurations, callback) {
    var self = this,
        buildConfiguration = buildConfigurations.shift()
    ;

    if (buildConfiguration) {
        var isGeneration = undefined === buildConfiguration.name;

        logger.log(
            '<<blue>><<bold>>><</bold>> {0}/<<bold>>{1}<</bold>> ({2})'.format(
                path.dirname(buildConfiguration.out),
                path.basename(buildConfiguration.out),
                !isGeneration ? buildConfiguration.name : '--generated--'
            ),
            1,
            1
        );

        if (isGeneration) {
            var content = utils.clone(buildConfiguration);

            delete content.out;

            var fileContent = 'requirejs.config({0});'.format(
                    JSON.stringify(content)
                )
            ;

            fs.writeFileSync(buildConfiguration.out, fileContent);
            self.buildClientFiles(buildConfigurations, callback);
        } else {
            var command = '{0} -o{1}'.format(
                    this._optimizationCommand,
                    this.buildCommandLine(buildConfiguration)
                )
            ;

            // Execute optimization command.
            exec(command, function (error, stdout, stderr) {
                try {
                    if (stderr) {
                        throw new Error(error);
                    } else if (stdout && -1 !== stdout.indexOf('Error:')) {
                        throw new Error(stdout);
                    } else if (error) {
                        throw error;
                    } else {
                        self.buildClientFiles(buildConfigurations, callback);
                    }
                } catch (error) {
                    logger.log('<<red>>{0}'.format(error.message), 1);
                    logger.log(
                        '<<grey>>{0}'.format(
                            error.stack.replace(error.message, '')
                        ),
                        2,
                        1,
                        0
                    );
                }
            });
        }
    } else {
        callback();
    }
}

/**
 * Build command line.
 *
 * @param {array} args The arguments.
 * @param {string} prefix The prefix.
 * @api protected
 */
AppBuilder.prototype.buildCommandLine = function(args, prefix) {
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
                this.buildCommandLine(value, field)
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

/**
 * Resolve paths.
 *
 * @param {string} modulePath The path of the module.
 * @param {string} danfPath The danf path.
 * @return {string_object} The resolved paths.
 * @api protected
 */
AppBuilder.prototype.resolvePaths = function(modulePath, danfPath) {
    var paths = {},
        dependenciesPath = path.join(modulePath, 'node_modules')
    ;

    if (path.join(danfPath, 'node_modules') !== dependenciesPath) {
        try {
            var modulesDirectory = fs.readdirSync(dependenciesPath).filter(function(file) {
                    return fs.statSync(path.join(dependenciesPath, file)).isDirectory();
                })
            ;

            for (var i = 0; i < modulesDirectory.length; i++) {
                var directory = modulesDirectory[i],
                    modulesDirectoryPath = path.join(dependenciesPath, directory)
                ;

                if (-1 !== directory.indexOf('.')) {
                    continue;
                }

                paths[directory + '.js'] = path.join(modulesDirectoryPath, 'index');
                paths[directory] = modulesDirectoryPath;

                // Merge module paths.
                var modulePaths = this.resolvePaths(modulesDirectoryPath, danfPath);

                for (var name in modulePaths) {
                    if (undefined === paths[name]) {
                        paths[name] = modulePaths[name];
                    }
                }
            }
        } catch (error) {
            // Handle not existing modules folder.
            if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
                throw error;
            }
        }
    }

    return paths;
}

/**
 * Build side configuration.
 *
 * @param {string} modulePath The path of the module.
 * @param {object} dependencies The dependencies.
 * @param {string} sideName The side name.
 * @return {object} The configuration.
 * @api protected
 */
AppBuilder.prototype.buildSideConfiguration = function(modulePath, dependencies, sideName) {
    // Prevent processing danf.
    if ('danf' === path.basename(modulePath)) {
        return;
    }

    var commonConfiguration = {},
        sideConfiguration = {},
        dependenciesConfiguration = {},
        dependenciesPath = path.join(modulePath, 'node_modules'),
        escapeRequires = 'client' === sideName
    ;

    // Build common configuration.
    try {
        var rootPath = path.join(modulePath, '/config/common');

        commonConfiguration = this.buildConfiguration(
            rootPath,
            rootPath
        );
    } catch (error) {
        // Handle not existing common config folder.
        if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
            throw error;
        }
    }

    // Build common classes configuration.
    try {
        if (undefined === commonConfiguration.config) {
            commonConfiguration.config = {};
        }

        var rootPath = path.join(modulePath, '/lib/common');

        commonConfiguration.config.classes = utils.merge(
            commonConfiguration.config.classes || {},
            this.buildConfiguration(
                rootPath,
                rootPath,
                true,
                escapeRequires
            ),
            true
        );
    } catch (error) {
        // Handle not existing common lib folder.
        if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
            throw error;
        }
    }

    // Build side configuration.
    try {
        var rootPath = path.join(modulePath, '/config/{0}'.format(sideName));

        sideConfiguration = this.buildConfiguration(
            rootPath,
            rootPath
        );
    } catch (error) {
        // Handle not existing side config folder.
        if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
            throw error;
        }
    }

    // Build side classes configuration.
    try {
        if (undefined === sideConfiguration.config) {
            sideConfiguration.config = {};
        }

        var rootPath = path.join(modulePath, '/lib/{0}'.format(sideName));

        sideConfiguration.config.classes = utils.merge(
            sideConfiguration.config.classes || {},
            this.buildConfiguration(
                rootPath,
                rootPath,
                true,
                escapeRequires
            ),
            true
        );
    } catch (error) {
        // Handle not existing side lib folder.
        if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
            throw error;
        }
    }

    // Build server side assets configuration.
    if ('server' === sideName) {
        try {
            if (undefined === sideConfiguration.config) {
                sideConfiguration.config = {};
            }

            var pack = require(path.join(modulePath, 'package.json')),
                assets = {}
            ;

            assets['-/{0}'.format(pack.name.replace(/^danf-/, ''))] = fs.realpathSync(
                path.join(modulePath, '/resource/public')
            );
            try {
                assets['favicon.png'] = fs.realpathSync(
                    path.join(modulePath, '/resource/public/img/favicon.png')
                );
            } catch (error) {}

            sideConfiguration.config.assets = utils.merge(
                sideConfiguration.config.assets || {},
                assets,
                true
            );
        } catch (error) {
            // Handle not existing side lib folder.
            if (
                !(error.code in {
                    'ENOENT': true,
                    'ENOTDIR': true,
                    'MODULE_NOT_FOUND': true
                })
            ) {
                throw error;
            }
        }
    }

    for (var name in dependencies) {
        var dependency = dependencies[name],
            dependencyConfiguration = dependency
        ;

        if ('object' === typeof dependency) {
            dependencyConfiguration = this.buildSideConfiguration(
                dependency.path,
                dependency.dependencies,
                sideName
            );
        }

        dependenciesConfiguration[name] = dependencyConfiguration;
    }

    // Merge common with side configurations, side overwriting common.
    var configuration = utils.merge(
            commonConfiguration,
            sideConfiguration,
            {dependencies: dependenciesConfiguration},
            true
        )
    ;

    return configuration;
}

/**
 * Build configuration.
 *
 * @param {string} currentPath The current path.
 * @param {string} rootPath The root path.
 * @param {string} flatten Whether or not to flatten the built configuration.
 * @param {boolean} escapeRequires Whether or not to escape requires.
 * @return {object} The configuration.
 * @api protected
 */
 AppBuilder.prototype.buildConfiguration = function(currentPath, rootPath, flatten, escapeRequires) {
    var configuration = {},
        directoryItems = fs.readdirSync(currentPath)
    ;

    for (var i = 0; i < directoryItems.length; i++) {
        var config = configuration,
            name = directoryItems[i],
            fullPath = path.join(currentPath, name),
            stats = fs.statSync(fullPath)
        ;

        // Prevent processing hidden items.
        if ('.' === name.charAt(0)) {
            continue;
        }

        // Handle directory.
        if (stats.isDirectory()) {
            // Merge subdirectory configuration.
            configuration = utils.merge(
                configuration,
                this.buildConfiguration(
                    fullPath,
                    rootPath,
                    flatten,
                    escapeRequires
                ),
                true
            );
        // Handle file.
        } else if (stats.isFile() && '.js' === path.extname(name)) {
            var config = configuration,
                interpretedPath = this.interpretPath(
                    fullPath
                        .replace(new RegExp('{0}$'.format(path.extname(fullPath)), 'g'), '')
                        .substr(rootPath.length)
                    ,
                    flatten ? '.' : '~'
                ),
                splitPath = this.splitPath(interpretedPath),
                pathSection
            ;

            // Reset require cache for the file
            // (useful for rebuilding new content).
            delete require.cache[require.resolve(fullPath)];

            // Build configuration.
            while (pathSection = splitPath.shift()) {
                // Handle standard filename.
                if (splitPath.length === 0) {
                    try {
                        var content = !escapeRequires
                                ? require(fullPath)
                                : 'require(\'{0}\')'.format(fullPath)
                        ;
                    } catch (error) {
                        error.message = 'Interpretation of "{0}" failed: "{1}"{2}.'.format(
                            fullPath,
                            error.message,
                            null != error.lineNumber
                                ? ' at line {0}'.format(error.lineNumber)
                                : ''
                        );

                        throw error;
                    }

                    if ('object' === typeof content && 'object' === typeof config[pathSection]) {
                        config[pathSection] = utils.merge(
                            config[pathSection],
                            content,
                            true
                        );
                    } else {
                        config[pathSection] = content;
                    }
                // Handle filename ending with a concatenable character.
                } else if (splitPath.length === 1 && /[-.:\/]$/.test(splitPath[0]) && !escapeRequires) {
                    var concat = function(fullPath, filename) {
                            var dependency = require(fullPath),
                                concatenatedDependency = {}
                            ;

                            if (
                                dependency &&
                                'object' === typeof dependency
                            ) {
                                for (var key in dependency) {
                                    var lastChar = filename.charAt(filename.length - 1),
                                        concatenatedKey = '{0}{1}'.format(
                                            filename.substr(0, filename.length - 1),
                                            '{0}{1}'.format(lastChar, key)
                                                .replace(/[-]([^.])/g, function(match, p1) {
                                                    return p1.toUpperCase();
                                                })
                                        )
                                    ;

                                    concatenatedDependency[concatenatedKey] = dependency[key];
                                }
                            } else {
                                concatenatedDependency[filename] = dependency;
                            }

                            return concatenatedDependency;
                        },
                        lastPathSection = splitPath.shift()
                    ;

                    config[pathSection] = utils.merge(
                        config[pathSection] || {},
                        concat(fullPath, lastPathSection),
                        true
                    );
                // Handle directory.
                } else if ('object' !== typeof config[pathSection]) {
                    config[pathSection] = {};
                }

                config = config[pathSection];
            }
        }
    }

    return configuration;
}

/**
 * Build dependencies.
 *
 * @param {string} rootPath The root path.
 * @param {function} callback The callback to process at the end of the build.
 * @api protected
 */
 AppBuilder.prototype.buildDependencies = function(rootPath, callback) {
    var isDanfModule = function(modulePath) {
            var isDanfModule = true;

            try {
                fs.statSync(path.join(
                    modulePath,
                    'danf.js'
                ));
            } catch (error) {
                isDanfModule = false;
            }

            return isDanfModule;
        }
    ;

    rpt(
        rootPath,
        function (error, data) {
            if (error) {
                throw error;
            }

            // Find danf dependencies in their correct dependency ordered tree
            // (defined by npm dependencies).
            var findDependencies = function(node, rooted) {
                    var formatName = function(name) {
                            return name
                                .replace(/^danf-/, '')
                                .replace(/[-]([^.])/g, function(match, p1) {
                                    return p1.toUpperCase();
                                })
                            ;
                        }
                    ;

                    if (
                        isDanfModule(node.realpath) &&
                        'danf' !== node.package.name
                    ) {
                        var dependency = {
                                id: node.package._id,
                                name: formatName(node.package.name),
                                version: node.package.version,
                                versions: [node.package.version],
                                path: node.realpath,
                                rooted: rooted,
                                dependencies: {}
                            },
                            packageDependencies = utils.merge(
                                node.package.dependencies,
                                node.package.devDependencies
                            )
                        ;

                        for (var name in packageDependencies) {
                            var currentNode = node;

                            findDependency:
                            while (currentNode) {
                                for (var i = 0; i < currentNode.children.length; i++) {
                                    var child = currentNode.children[i],
                                        childName = child.package.name
                                    ;

                                    if (childName === name) {
                                        var childDependency = findDependencies(
                                                child,
                                                null == rooted ? false : true
                                            ),
                                            dependencyName = formatName(childName)
                                        ;

                                        if (childDependency) {
                                            dependency.dependencies[dependencyName] = childDependency;
                                        }

                                        break findDependency;
                                    }
                                }

                                currentNode = currentNode.parent;
                            }
                        }

                        return dependency;
                    }
                }
            ;

            var dependencies = findDependencies(data),
                dependedUpon = {}
            ;

            dependencies = dependencies ? dependencies.dependencies : {};

            // Fill the first step of dependencies with all the dependencies.
            var buildRootDependencies = function(contextDependencies, rootDependencies) {
                    for (var name in contextDependencies) {
                        var contextDependency = contextDependencies[name],
                            dependency = dependencies[name],
                            diff
                        ;

                        if (
                            undefined === rootDependencies[name] &&
                            (
                                !dependency ||
                                semver.gt(
                                    contextDependency.version,
                                    dependency.version
                                )
                            )
                        ) {
                            var aliasedDependency = utils.clone(contextDependency);

                            aliasedDependency.rooted = true;
                            dependencies[name] = aliasedDependency;
                        }

                        if (
                            dependency &&
                            (diff = semver.diff(
                                contextDependency.version || '0.0.0',
                                dependency.version || '0.0.0'
                            ))
                        ) {
                            if (undefined === dependency.versions) {
                                dependency.conflict = versionDiff[diff];
                            }

                            dependencies[name].versions = dependency.versions.concat(
                                contextDependency.versions
                            );
                            dependencies[name].conflict = !dependency.conflict
                                ? versionDiff[diff]
                                : Math.min(
                                    dependency.conflict,
                                    versionDiff[diff]
                                )
                            ;
                        }

                        buildRootDependencies(contextDependency.dependencies, rootDependencies);
                    }
                }
            ;

            buildRootDependencies(dependencies, utils.clone(dependencies));

            // Flatten the dependencies.
            var flattenDependencies = function(contextDependencies, namespace) {
                    var aliases = {};

                    for (var name in contextDependencies) {
                        var contextDependency = utils.clone(dependencies[name]),
                            fullName = '{0}{1}'.format(
                                namespace ? '{0}:'.format(namespace) : '',
                                name
                            )
                        ;

                        aliases[name] = '{0}'.format(contextDependency.name);

                        var flattenedDependencies = flattenDependencies(
                                contextDependency.dependencies,
                                fullName
                            )
                        ;

                        for (var dependencyName in flattenedDependencies) {
                            var flattenedDependency = flattenedDependencies[dependencyName],
                                composedName = '{0}:{1}'.format(name, dependencyName)
                            ;

                            dependedUpon[flattenedDependency] = true;

                            aliases[dependencyName] = flattenedDependency;
                            aliases[composedName] = flattenedDependency;
                        }

                        contextDependency.dependencies = flattenedDependencies;
                        contextDependencies[name] = contextDependency;
                    }

                    return aliases;
                }
            ;

            var aliases = flattenDependencies(dependencies, '');

            dependencies = utils.merge(aliases, dependencies);

            // Purge useless dependencies.
            var dependenciesVersions = {};

            for (var name in dependencies) {
                var dependency = dependencies[name];

                if (dependency.rooted) {
                    if (!dependedUpon[name]) {
                        delete dependencies[name];

                        for (var dependencyName in dependencies) {
                            var namePattern = new RegExp('^{0}:'.format(name));

                            if (namePattern.test(dependencyName)) {
                                delete dependencies[dependencyName];
                            }
                        }
                    }
                }

                delete dependency.rooted;
            }

            // Format conflicts.
            for (var name in dependencies) {
                var dependency = dependencies[name];

                if ('object' === typeof dependency && dependency.versions) {
                    dependency.versions = dependency.versions
                        .filter(function(item, pos, self) {
                            return self.indexOf(item) == pos;
                        })
                        .sort()
                        .reverse()
                    ;
                }
            }

            callback(dependencies);
        }
    );
 }

/**
 * Display dependencies.
 *
 * @param {string} dependencies The dependencies.
 * @api protected
 */
 AppBuilder.prototype.displayDependencies = function(dependencies) {
    var hasDependencies = false,
        orderedNames = Object.keys(dependencies).sort()
    ;

    // Display dependencies in ASCII name order.
    for (var i = 0; i < orderedNames.length; i++) {
        if (!hasDependencies) {
            logger.log(
                '<<bold>><<grey>>Dependencies:',
                1
            );

            hasDependencies = true;
        }

        var name = orderedNames[i],
            dependency = dependencies[name]
        ;

        if ('object' === typeof dependency) {
            var versions = [];

            for (var j = 0; j < dependency.versions.length; j++) {
                var version = dependency.versions[j];

                versions.push(
                    version === dependency.version
                        ? '<<bold>>{0}<</bold>>'.format(version)
                        : version
                );
            }

            var color = 'green';

            if (null != dependency.conflict) {
                // Handle not compatible versions according to SemVer.
                if (
                    dependency.conflict <= versionDiff.premajor ||
                    (
                        dependency.conflict <= versionDiff.preminor &&
                        /^[^.]*0\./.test(dependency.version)
                    )
                ) {
                    color = 'red';
                // Handle compatible versions according to SemVer.
                } else {
                    color = 'yellow';
                }
            }

            logger.log(
                '<<white>>{0} <<grey>>- <<{1}>>{2}'.format(
                    name,
                    color,
                    versions.join(' ')
                ),
                1,
                1
            );
        }
    }

    // Handle case of no dependency.
    if (!hasDependencies) {
        logger.log(
            '<<bold>><<grey>>No dependencies.',
            1
        );
    }
}

/**
 * Interpret a cluster.
 *
 * @param {object} context The server context.
 * @param {number|null} maxWorkers The optional max workers number.
 * @param {object[null} availableServers The optional available servers.
 * @return {object} The interpreted cluster.
 * @api protected
 */
AppBuilder.prototype.interpretCluster = function(context, maxWorkers, availableServers) {
    // Handle case of a not clustered server.
    if (!context.cluster) {
        Object.checkType(context.listen, 'string|string_array|null');
        Object.checkType(context.port, 'number|null');

        if (context.listen) {
            if (!context.port) {
                throw new Error(
                    'A listening server must define a port.'
                );
            }

            this.checkServerAvailability(context.listen, availableServers);
        }

        return;
    }

    // Merge cluster context with app context.
    var interpretedCluster = [],
        appContext = utils.clone(context)
    ;

    delete appContext.cluster;

    for (var i = 0; i < context.cluster.length; i++) {
        interpretedCluster[i] = utils.merge(
            appContext,
            context.cluster[i]
        )
    }

    // Check cluster definition validity.
    var ports = {},
        fillerChunk,
        usedWorkers = 0
    ;

    for (var i = 0; i < interpretedCluster.length; i++) {
        var chunk = interpretedCluster[i];

        // Check types and values.
        Object.checkType(chunk.listen, 'string|string_array');

        if (!chunk.port) {
            throw new Error(
                'A listening server must define a port.'
            );
        }

        Object.checkType(chunk.port, 'number');
        Object.checkType(chunk.workers, 'number|null');

        // Check listen.
        if ('string' !== typeof chunk.listen) {
            for (var j = 0; j < chunk.listen.length; j++) {
                if (!this.isSharableServer(chunk.listen[j], availableServers)) {
                    throw new Error(
                        'Server of type "{0}" cannot share listening.'.format(
                            chunk.listen[j]
                        )
                    );
                }
            }
        }

        chunk.proxy = this.needsProxyServer(chunk.listen, availableServers);

        // Check port.
        if (ports[chunk.port]) {
            throw new Error(
                'Cannot use the same port "{0}" for different cluster chunks.'.format(
                    chunk.port
                )
            );
        }

        ports[chunk.port] = true;

        // Check workers.
        chunk.workers = null != chunk.workers ? chunk.workers : 1;

        if (chunk.workers <= 0) {
            if (undefined !== fillerChunk) {
                throw new Error(
                    'Cannot define many filler chunk in a cluster.'
                );
            }

            fillerChunk = i;
        } else {
            usedWorkers += chunk.workers;
        }
    }

    // Interpret cluster values.
    maxWorkers = null != maxWorkers
        ? maxWorkers
        : os.cpus().length
    ;

    if (null != fillerChunk) {
        var chunk = interpretedCluster[fillerChunk];

        chunk.workers += maxWorkers - usedWorkers;
        chunk.workers = chunk.workers > 0 ? chunk.workers : 1;
        usedWorkers += chunk.workers;
    }

    if (usedWorkers > maxWorkers && cluster.isMaster) {
        logger.log(
            '<<yellow>>Your number of workers is above your host CPU cores (<<bold>>{0}<</bold>>/{1}).'.format(
                usedWorkers,
                maxWorkers
            ),
            1
        );
    }

    return interpretedCluster;
}

/**
 * Check server availability.
 *
 * @param {string|string_array} servers The server or servers.
 * @param {object[null} availableServers The optional available servers.
 * @return {object} The available servers.
 * @throws {error} If a server is not in the list of available servers.
 * @api protected
 */
AppBuilder.prototype.checkServerAvailability = function(servers, availableServers) {
    availableServers = availableServers ? availableServers : this._availableServers;

    var message = 'Server of type "{0}" are not handled.';

    if ('string' === typeof servers) {
        if (!(servers in availableServers)) {
            throw new Error(message.format(servers));
        }
    } else {
        for (var i = 0; i < servers.length; i++) {
            if (!(servers[i] in availableServers)) {
                throw new Error(message.format(servers[i]));
            }
        }
    }

    return availableServers;
}

/**
 * Whether or not the server is a sharable server.
 *
 * @param {string|string_array} servers The server or servers.
 * @param {object[null} availableServers The optional available servers.
 * @return {boolean} True if this is a sharable server, false otherwise.
 * @api protected
 */
AppBuilder.prototype.isSharableServer = function(servers, availableServers) {
    availableServers = this.checkServerAvailability(servers, availableServers);

    if ('string' === typeof servers) {
        return !!availableServers[servers].sharable;
    } else {
        for (var i = 0; i < servers.length; i++) {
            return !!availableServers[servers[i]].sharable;
        }
    }
}

/**
 * Whether or not the server needs a proxy.
 *
 * @param {string|string_array} servers The server or servers.
 * @param {object[null} availableServers The optional available servers.
 * @return {boolean} True if the server needs a proxy server, false otherwise.
 * @api protected
 */
AppBuilder.prototype.needsProxyServer = function(servers, availableServers) {
    availableServers = this.checkServerAvailability(servers, availableServers);

    if ('string' === typeof servers) {
        return !!availableServers[servers].proxy;
    } else {
        for (var i = 0; i < servers.length; i++) {
            return !!availableServers[servers[i]].proxy;
        }
    }
}

/**
 * Format handled entities.
 *
 * @param {string|string_array} servers The server or servers.
 * @param {object[null} availableServers The optional available servers.
 * @return {string} The formatted handled entities.
 * @api protected
 */
AppBuilder.prototype.formatHandledEntities = function(servers, availableServers) {
    availableServers = this.checkServerAvailability(servers, availableServers);

    var handledEntities = [];

    if ('string' === typeof servers) {
        handledEntities.push(
            '<<bold>>{0}<</bold>>'.format(
                availableServers[servers].handle
            )
        );
    } else {
        for (var i = 0; i < servers.length; i++) {
            handledEntities.push(
                '<<bold>>{0}<</bold>>'.format(
                    availableServers[servers[i]].handle
                )
            );
        }
    }

    return handledEntities.join(' and ')
}

/**
 * Relativize a path to the common path.
 *
 * @param {string} targetPath The path.
 * @return {string} The relative path.
 * @api protected
 */
AppBuilder.prototype.relativizePath = function(targetPath) {
    if ('.js' !== targetPath.slice(-3)) {
        targetPath += '.js';
    }

    var relativizedPath;

    try {
        relativizedPath = require.resolve(targetPath);
    } catch (error) {}

    if (null == relativizedPath) {
        relativizedPath = fs.realpathSync(path.join(this._paths.common, targetPath));
    }

    return path.relative(this._paths.common, relativizedPath).replace(/\.js$/, '');
}

/**
 * Interpret a path.
 *
 * 'foo-bar' => 'fooBar'
 * '-foo-bar' => 'FooBar'
 * 'foo-.bar', => 'foo-bar'
 * 'foo.bar' => 'foo.bar'
 * 'foo&dev' => 'foo/dev'
 * 'foo.-bar' => 'foo.Bar'
 * 'foo~bar' => 'foo~bar'
 * 'foo~.bar' => 'foo~.bar'
 * 'foo;bar' => 'foo:bar'
 * 'ab-c-d-.efg.hI.-jk~l;mn.op~qrs.-t-.vw&xyz' => 'abCD-efg.hI.Jk~l:mn.op~qrs.T-vw/xyz'
 * 'abc/def/ghi' => 'abc~def~ghi'
 * 'abc/def./ghi' => 'abc~def.ghi'
 *
 * @param {string} targetPath The path.
 * @param {string} pathSeparator The path separator replacing the OS path separator.
 * @return {string} The interpreted path.
 * @api protected
 */
AppBuilder.prototype.interpretPath = function(targetPath, pathSeparator) {
    var interpretedPath = targetPath
        .replace(new RegExp('([^-.;&])\\{0}'.format(path.sep), 'g'), function(match, p1) {
            return p1 + pathSeparator;
        })
        .replace(new RegExp(path.sep, 'g'), '')
        .replace(/[-]([^.])/g, function(match, p1) {
            return p1.toUpperCase();
        })
        .replace(/;/g, ':')
        .replace(/&/g, '/')
        .replace(/([-;&])\./g, function(match, p1) {
            return p1;
        })
    ;

    return interpretedPath;
}

/**
 * Split a path.
 *
 * @param {string} targetPath The path.
 * @return {array} The split path.
 * @api protected
 */
AppBuilder.prototype.splitPath = function(targetPath) {
    return targetPath
        .split(/[~](?!\.)/g)
        .map(function(item) {
            return item.replace(/~\./g, '~')
        })
    ;
}

/**
 * Log listening.
 *
 * @param {string} server The server type.
 * @param {number} port The listening port.
 * @param {string} environment The execution environment.
 * @param {array|null} cluster The cluster definition.
 * @api private
 */
var logListening = function(server, port, environment, cluster) {
    if (server) {
        logger.log(
            '<<yellow>><<bold>>{0}<</bold>> server listening...'.format(
                server
            ),
            1
        );
    } else {
        logger.log(
            '<<yellow>><<bold>>Server<</bold>> listening...'.format(
                server
            ),
            1
        );
    }
    if (port) {
        logger.log(
            '<<yellow>><<bold>>><</bold>> port       : <<bold>>{0}<</bold>>'.format(
                port
            ),
            1,
            1
        );
    }
    logger.log(
        '<<yellow>><<bold>>><</bold>> environment: <<bold>>{0}<</bold>>'.format(
            environment
        ),
        1,
        1
    );
    if (cluster) {
        var workers = 0,
            maxWorkers = os.cpus().length
        ;

        for (var i = 0; i < cluster.length; i++) {
            workers += cluster[i].workers;
        }
        logger.log(
            '<<yellow>><<bold>>><</bold>> workers    : <<bold>>{0}<</bold>>/{1}'.format(
                workers,
                maxWorkers
            ),
            1,
            1
        );
    }
    logger.log('<<yellow>><<bold>>____________________', 1);
};
