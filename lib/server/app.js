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
    toSource = require('tosource'),
    utils = require('../common/utils'),
    Logger = require('../common/logging/logger'),
    Framework = require('../common/framework/framework'),
    Initializer = require('../common/framework/initializer'),
    InitializerServer = require('./framework/initializer')
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
    this._serverContext = serverContext;
    this._clientContext = clientContext;
    this._paths = {};

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
            path.dirname(this._paths.appAbsolute),
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
    this._serverContext = utils.merge(
            {
                app: 'main',
                environment: 'dev',
                debug: true,
                verbosity: 5,
                ports: {
                    http: 3080,
                    command: 3111
                },
                cluster: {
                    workers: {
                        http: 1,
                        command: 1
                    },
                    active: true
                },
                secret: 'bad secret',
                clientBuiltPath: this._paths.clientBuilt
            },
            this._serverContext,
            true
        )
    ;

    // Format context.
    this._clientContext = utils.merge(
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
                    'command',
                    'vendor',
                    'ajax-app'
                ]
            },
            this._clientContext,
            true
        )
    ;

    // Compute real workers numbers.
    this._serverContext.cluster.workers = this.computeWorkersNumbers(
        this._serverContext.cluster.workers,
        require('os').cpus().length
    );

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

    if (cluster.isMaster || !context.cluster.active) {
        logger.log('<<yellow>><<bold>>Server<</bold>> building...', 1);
    }

    if ('string' === typeof this._serverConfiguration) {
        // Handle auto configuration building.
        if ('auto' === this._serverConfiguration) {
            this._serverConfiguration = self.buildSideConfiguration(
                this._paths.appAbsolute,
                'server'
            );
        // Handle server configuration path.
        } else {
            this._serverConfiguration = require(this._serverConfiguration);
        }
    }

    var isListening = false,
        cpuCount = require('os').cpus().length
    ;

    // Process master.
    if (cluster.isMaster && context.cluster.active) {
        var processingWorkers = 0,
            totalWorkersNumber = 0
        ;

        for (var type in context.cluster.workers) {
            totalWorkersNumber += context.cluster.workers[type];
        }

        // Create workers.
        for (var type in this._serverContext.cluster.workers) {
            var workersNumber = this._serverContext.cluster.workers[type],
                forkWorker = function(type) {
                    var worker = cluster.fork({type: type});

                    worker.on('listening', function(address) {
                        logger.log(
                            '<<green>>Worker <<bold>>{0}<</bold>> processing <<bold>>{1}<</bold>> on port <<bold>>{2}<</bold>>...'.format(
                                worker.id,
                                'command' === type ? 'commands' : 'HTTP requests',
                                address.port
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
                                forkWorker(type);
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
                }
            ;

            for (var i = 0; i < workersNumber; i++) {
                forkWorker(type);
            }
        }

        cluster.on('listening', function(worker, address) {
            isListening = true;
            processingWorkers++;

            if (processingWorkers === totalWorkersNumber) {
                logListening('', '', self._serverContext.environment, context.cluster.workers, cpuCount);
            }
        });
    } else {
        if (cluster.worker) {
            var workerId = cluster.worker.id;

            context.cluster.worker = workerId;
            logger.log('<<green>>Worker <<bold>>{0}<</bold>> starting...'.format(workerId), 1);
        }

        var app = express();

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
        app.create = function(callback) {
            this.context = context;
            this.clientContext = self._clientContext;

            this.useBeforeRouting();

            // Build framework.
            var framework = new Framework(),
                initializer = new Initializer(),
                initializerServer = new InitializerServer()
            ;

            framework.addInitializer(initializer);
            framework.addInitializer(initializerServer);
            framework.set('danf:app', this);
            framework.build(self._serverConfiguration, context);

            this.servicesContainer = framework.objectsContainer;

            this.useAfterRouting();

            if (callback) {
                Object.checkType(callback, 'function');

                callback(this);
            }
        };

        /**
         * Log listening.
         *
         * @param {string} server The server type.
         * @param {number} port The listening port.
         */
        app.logListening = function(server, port) {
            logListening(server, port, app.context.environment, context.cluster.workers, cpuCount);
        };

        /**
         * Listen to HTTP requests.
         *
         * @param {function} end An optionnal callback to be called at the end of listening.
         * @api publi
         c
         */
        app.listen = function(end) {
            switch (cluster.worker.process.env.type) {
                case 'command':
                    this.listenCmd(end);

                    break;
                default:
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
                port = this.context.ports.http
            ;

            server.on('close', function(error) {
                logger.log(
                    '<<yellow>>HTTP server listening ended.'.format(
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
                if (!app.context.cluster.active) {
                    app.logListening('HTTP', port);
                }
            });
        };

        /**
         * Listen to commands.
         *
         * @param {function} end An optionnal callback to be called at the end of listening.
         * @api public
         */
        app.listenCmd = function(end) {
            var net = require('net');

            var server = net.createServer(function(socket) {}),
                port = this.context.ports.command
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

                    app.executeCmd(line, function(data) {
                        if (data instanceof Error) {
                            socket.end(
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
                if (!app.context.cluster.active) {
                    app.logListening('Command', port);
                }
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
                logger.log('<<grey>>{0}'.format(error.stack), 2, 1);

                callback(error);
            }
        };

        app.builder = self;
        app.create(done);

        return app;
    }
}

/**
 * Build client.
 *
 * @param {function} done Callback executed at the end of the build.
 * @api public
 */
AppBuilder.prototype.buildClient = function(done) {
    var self = this,
        context = this._clientContext
    ;

    logger.log('<<cyan>><<bold>>Client<</bold>> building...', 1);

    // Handle auto configuration building.
    if ('auto' === this._clientConfiguration) {
        this._clientConfiguration = self.buildSideConfiguration(
            this._paths.appAbsolute,
            'client'
        );
    }

    var buildConfigurations = [];

    buildConfigurations.push(this.clientDanfBuildConfiguration);
    buildConfigurations.push(this.clientAppBuildConfiguration);
    buildConfigurations.push(this.clientRequireBuildConfiguration);
    buildConfigurations.push(this.clientJqueryBuildConfiguration);
    buildConfigurations.push(this.clientInitBuildConfiguration);
    buildConfigurations.push(this.clientConfigBuildConfiguration);

    // Build client JS and create forks to process requests.
    self.buildClientFiles(buildConfigurations, function() {
        logger.log('<<cyan>><<bold>>____________________', 1);

        if (done) {
            done();
        }
    });
}

/**
 * Build configuration for client danf file.
 *
 * @var {object}
 * @api public
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
 * @api public
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
 * @api public
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
 * @api public
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
 * @api public
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
 * @api public
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
 * @api public
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
                    logger.log('<<grey>>{0}'.format(error.stack), 2, 1);
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
 * @param {string} sideName The side name.
 * @return {object} The configuration.
 * @api protected
 */
AppBuilder.prototype.buildSideConfiguration = function(modulePath, sideName) {
    // Prevent processing danf.
    if ('danf' === path.basename(modulePath)) {
        return;
    }

    var commonConfiguration = {},
        sideConfiguration = {},
        dependenciesConfiguration = {},
        dependenciesPath = path.join(modulePath, 'node_modules'),
        escapeRequires = 'client' === sideName;
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

            assets['-/{0}'.format(pack.name)] = fs.realpathSync(
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

    try {
        var modulesDirectory = fs.readdirSync(dependenciesPath).filter(function(file) {
                return fs.statSync(path.join(dependenciesPath, file)).isDirectory();
            })
        ;

        for (var i = 0; i < modulesDirectory.length; i++) {
            var directory = modulesDirectory[i],
                modulesDirectoryPath = path.join(dependenciesPath, directory)
            ;

            try {
                var stats = fs.statSync(
                    path.join(modulesDirectoryPath, 'danf.js')
                );

                if (stats.isFile()) {
                    var dependencyConfiguration = this.buildSideConfiguration(
                            modulesDirectoryPath,
                            sideName
                        )
                    ;

                    if (dependencyConfiguration) {
                        dependenciesConfiguration[directory] = dependencyConfiguration;
                    }
                }
            } catch (error) {
                // Handle not existing danf entry file.
                if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
                    throw error;
                }
            }
        }
    } catch (error) {
        // Handle not existing dependencies folder.
        if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
            throw error;
        }
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
                        throw new Error('Interpretation of "{0}" failed: "{1}"{2}.'.format(
                            fullPath,
                            error.message,
                            null != error.lineNumber
                                ? ' at line {0}'.format(error.lineNumber)
                                : ''
                        ));
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
 * Compute workers numbers.
 *
 * @param {object} desiredWorkersNumbers The desired workers numbers.
 * @param {number} maxWorkers The maximum number of workers.
 * @return {object} The real workers numbers.
 * @api protected
 */
AppBuilder.prototype.computeWorkersNumbers = function(desiredWorkersNumbers, maxWorkers) {
    var workersNumbers = {},
        totalWorkersNumber = 0,
        fillerWorkers
    ;

    for (var key in desiredWorkersNumbers) {
        var workersNumber = desiredWorkersNumbers[key];

        if (null == workersNumber) {
            workersNumbers[key] = 0;
        } else if (workersNumber <= 0) {
            if (fillerWorkers) {
                throw new Error('Cannot define a number lower than or equal to 0 for more than one type of workers.');
            }

            fillerWorkers = key;
        } else {
            workersNumbers[key] = workersNumber;
            totalWorkersNumber += workersNumber;
        }
    }

    if (fillerWorkers) {
        var desiredWorkersNumber = desiredWorkersNumbers[fillerWorkers],
            workersNumber = maxWorkers - totalWorkersNumber + desiredWorkersNumber
        ;

        workersNumbers[key] = workersNumbers <= 0 ? 1 : workersNumber;
        totalWorkersNumber += workersNumbers[key];
    }

    if (totalWorkersNumber > maxWorkers) {
        logger.log(
            '<<yellow>>Your number of workers is above your host CPU cores (<<bold>>{0}<</bold>>/{1}).'.format(
                totalWorkersNumber,
                maxWorkers
            )
        );
    }

    return workersNumbers;
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
 * @param {number} workersNumbers The workers numbers.
 * @param {number} maxWorkers The workers max number.
 * @api private
 */
var logListening = function(server, port, environment, workersNumbers, maxWorkers) {
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
    var workersNumber = 0;
    for (var type in workersNumbers) {
        workersNumber += workersNumbers[type];
    }
    logger.log(
        '<<yellow>><<bold>>><</bold>> workers    : <<bold>>{0}<</bold>>/{1}'.format(
            workersNumber,
            maxWorkers
        ),
        1,
        1
    );
    logger.log('<<yellow>><<bold>>____________________', 1);
};