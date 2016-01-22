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
    var self = createApplication.prototype;

    Object.checkType(serverConfiguration, 'object|string');
    Object.checkType(clientConfiguration, 'object|string|null');

    // Build paths.
    var danfPath = fs.realpathSync(path.join(__dirname, '/../..')),
        clientConfigurationPath = 'string' === typeof clientConfiguration
            ? fs.realpathSync(clientConfiguration)
            : path.join(__dirname, '/../client/danf.js')
        ,
        danfMainAbsolutePath = require.resolve('../client/main'),
        appMainAbsolutePath = fs.realpathSync(clientConfigurationPath),
        pathParts = appMainAbsolutePath.split(path.sep),
        commonPath = appMainAbsolutePath
    ;

    while (pathParts.pop()) {
        if (-1 !== danfPath.indexOf(commonPath)) {
            break;
        }

        commonPath = pathParts.join(path.sep);
    }

    var clientMainPath = serverContext && serverContext.clientMainPath
            ? serverContext.clientMainPath
            : path.join(commonPath, '.bin').replace(/\\/g, '/')
    ;

    // Handle client configuration retreiving.
    if (
        clientConfiguration &&
        'string' === typeof clientConfiguration &&
        'auto' === require(clientConfiguration)
    ) {
        clientConfiguration = self.buildSideConfiguration(
            path.dirname(clientConfigurationPath),
            danfPath,
            'client'
        );
    }

    // Handle server configuration retreiving.
    if ('string' === typeof serverConfiguration) {
        var serverConfigurationPath = fs.realpathSync(serverConfiguration),
            serverConfiguration = require(serverConfiguration);

        if ('auto' === serverConfiguration) {
            serverConfiguration = self.buildSideConfiguration(
                path.dirname(serverConfigurationPath),
                danfPath,
                'server'
            );
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

            for (var i = 0; i < args.length; i++) {
                var argParts = args[i].split('='),
                    name = argParts[0],
                    value = argParts[1]
                ;

                context[name] = undefined !== value ? value : true;
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
                secret: 'bad secret',
                clientMainPath: clientMainPath,
                nobuild: false
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
            danfMainRelativePath = path.relative(commonPath, danfMainAbsolutePath).replace(/\.js$/, ''),
            appMainRelativePath = path.relative(commonPath, appMainAbsolutePath).replace(/\.js$/, ''),
            danfRelativePath = danfMainRelativePath.slice(0, -(build.name.length)),
            relativizePath = function(targetPath) {
                if ('.js' !== targetPath.slice(-3)) {
                    targetPath += '.js';
                }

                var relativizedPath;

                try {
                    relativizedPath = require.resolve(targetPath);
                } catch (error) {}

                if (null == relativizedPath) {
                    relativizedPath = fs.realpathSync(path.join(commonPath, targetPath));
                }

                return path.relative(commonPath, relativizedPath).replace(/\.js$/, '');
            },
            buildConfigurations = [],
            resolvedPaths = self.resolvePaths(path.dirname(appMainAbsolutePath), path.join(commonPath, danfRelativePath));
        ;

        commonPath = commonPath.replace(/\\/g, '/');
        danfMainRelativePath = danfMainRelativePath.replace(/\\/g, '/');
        appMainRelativePath = appMainRelativePath.replace(/\\/g, '/');

        // Set build configuration for danf client JS file.
        var buildConfiguration = {
                baseUrl: commonPath,
                name: danfMainRelativePath,
                out: path.join(clientMainPath, 'danf.js'),
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
                    ? relativizePath(path.join(danfRelativePath, build.paths[key]))
                    : relativizePath(build.paths[key])
                ;
            }
        }

        for (var key in build.map) {
            key = 0 === key.indexOf('lib')
                ? relativizePath(path.join(danfRelativePath, key))
                : key
            ;

            if (undefined === map[key]) {
                map[key] = build.map[key] = {};
            }

            for (var embeddedKey in build.map[key]) {
                embeddedKey = 0 === embeddedKey.indexOf('lib')
                    ? relativizePath(path.join(danfRelativePath, embeddedKey))
                    : embeddedKey
                ;

                map[key][embeddedKey] = 0 === build.map[key][embeddedKey].indexOf('lib')
                    ? relativizePath(path.join(danfRelativePath, build.map[key][embeddedKey]))
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
            out: path.join(clientMainPath, 'require.js'),
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
            out: path.join(clientMainPath, 'jquery.js'),
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
            out: path.join(clientMainPath, 'init.js'),
            optimize: optimize,
            absolutise: true
        };

        buildConfigurations.push(buildConfiguration);

        // Set build configuration for app client JS file.
        if ('object' === typeof clientConfiguration) {
            // Generate a temporary config entry file.
            var appEntryBuildFilename = path.join(path.dirname(appMainAbsolutePath), 'app-config-generated-entry.js');

            fs.writeFileSync(
                appEntryBuildFilename,
                'module.exports = {0};'.format(toSource(clientConfiguration).replace(
                    /"require\('([^)]*)'\)"/g,
                    function(match, moduleFullPath) {
                        return 'require(\'{0}\')'.format(
                            moduleFullPath.replace(commonPath + '/', '')
                        );
                    }
                ))
            );

            appMainRelativePath = appEntryBuildFilename;
        }

        buildConfiguration = {
            baseUrl: commonPath,
            name: appMainRelativePath,
            out: path.join(clientMainPath, 'app.js'),
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
            out: path.join(clientMainPath, 'config.js')
        };

        buildConfigurations.push(buildConfiguration);

        // Build client JS and create forks to process requests.
        var binPath = '';

        try {
            binPath = path.join(
                path.dirname(appMainAbsolutePath),
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

        var commandName = -1 === os.platform().indexOf('win')
                ? 'node ' + fs.realpathSync(path.join(binPath, 'gnucki-r.js'))
                : fs.realpathSync(path.join(binPath, 'gnucki-r.js.cmd'))
        ;

        self.buildClientJs(buildConfigurations, !context.nobuild, commandName, function () {
            // Remove temporary config entry file.
            if ('undefined' !== typeof appEntryBuildFilename) {
                fs.unlinkSync(appEntryBuildFilename);
            }

            // Create workers.
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
 * @param {boolean} rebuild Whether or not to rebuild an already existing file.
 * @param {string} commandName The building command name.
 * @param {function} callback The callback to execute at the end.
 */
createApplication.prototype.buildClientJs = function(buildConfigurations, rebuild, commandName, callback) {
    var self = this,
        buildConfiguration = buildConfigurations.shift()
    ;

    if (buildConfiguration) {
        // Prevent not desired rebuilding.
        if (!rebuild) {
            try {
                fs.statSync(buildConfiguration.out);

                logger.log(
                    '<<yellow>>><</yellow>> {0} (--already generated--)'.format(
                        buildConfiguration.out
                    ),
                    1,
                    1
                );

                self.buildClientJs(buildConfigurations, rebuild, commandName, callback);

                return;
            } catch (error) {
                // Handle not existing file.
                if (!(error.code in {'ENOENT': true})) {
                    throw error;
                }
            }
        }

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
            self.buildClientJs(buildConfigurations, rebuild, commandName, callback);
        } else {
            var command = '{0} -o{1}'.format(
                    commandName,
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
                        self.buildClientJs(buildConfigurations, rebuild, commandName, callback);
                    }
                } catch (error) {
                    logger.log('<<red>>{0}'.format(error.message));
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
 */
createApplication.prototype.buildCommandLine = function(args, prefix) {
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
 */
createApplication.prototype.resolvePaths = function(modulePath, danfPath) {
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
 * @param {string} danfPath The danf path.
 * @param {string} sideName The side name.
 * @return {object} The configuration.
 */
createApplication.prototype.buildSideConfiguration = function(modulePath, danfPath, sideName) {
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

                try {
                    var stats = fs.statSync(
                        path.join(modulesDirectoryPath, 'danf-{0}.js'.format(sideName))
                    );

                    if (stats.isFile()) {
                        dependenciesConfiguration[directory] = this.buildSideConfiguration(
                            modulesDirectoryPath,
                            danfPath,
                            sideName
                        );
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
 *
 * @return {object} The configuration.
 */
 createApplication.prototype.buildConfiguration = function(currentPath, rootPath, flatten, escapeRequires) {
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
 *
 * @return {string} The interpreted path.
 */
createApplication.prototype.interpretPath = function(targetPath, pathSeparator) {
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
 *
 * @return {string} The split path.
 */
createApplication.prototype.splitPath = function(targetPath) {
    return targetPath
        .split(/[~](?!\.)/g)
        .map(function(item) {
            return item.replace(/~\./g, '~')
        })
    ;
}