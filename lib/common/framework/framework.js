'use strict';

/**
 * Expose `Framework`.
 */
module.exports = Framework;

/**
 * Module dependencies.
 */
var utils = require('../utils'),
    objectsContainer = {
        has: function(id) {
            return undefined !== this.objects[id] ? true : false;
        },
        get: function(id) {
            if (!this.has(id)) {
                throw new Error('The object "{0}" is not defined.'.format(id))
            }

            return this.objects[id];
        },
        set: function(id, object) {
            this.objects[id] = object;
        }
    }
;

objectsContainer.objects = {};

/**
 * Initialize a new framework.
 */
function Framework() {
    this._initializers = [];
    this._objects = {};
    this.objectsContainer = objectsContainer;
}

/**
 * Objects container.
 *
 * @var {object}
 * @api public
 */
Object.defineProperty(Framework.prototype, 'objectsContainer', {
    get: function() { return this._objectsContainer; },
    set: function(objectsContainer) { this._objectsContainer = objectsContainer; }
});

/**
 * Add an initializer.
 *
 * @param {object} initializer The initializer.
 * @api public
 */
Framework.prototype.addInitializer = function(initializer) {
    this._initializers.push(initializer);
}

/**
 * Whether or not an object has been instanciated.
 *
 * @param {String} id The id of the object.
 * @api public
 */
Framework.prototype.has = function(id) {
    return this._objectsContainer.has(id);
}

/**
 * Get an object.
 *
 * @param {String} id The id of the service.
 * @return {Object} The service object.
 * @api public
 */
Framework.prototype.get = function(id) {
    return this._objectsContainer.get(id);
}

/**
 * Set an object.
 *
 * @param {String} id The id of the object.
 * @param {Object} service The object.
 * @api public
 */
Framework.prototype.set = function(id, object) {
    this._objectsContainer.set(id, object);
}

/**
 * Build the framework.
 *
 * @param {object} configuration The application danf configuration.
 * @param {object} context The application context.
 * @param {danf:logging.logger|null} logger The application context.
 * @param {function|null} callback A callback called at the end of the framework initialization.
 * @api public
 */
Framework.prototype.build = function(configuration, context, logger, callback) {
    var self = this,
        parameters = {context: context}
    ;

    // Instantiate objects.
    for (var i = 0; i < this._initializers.length; i++) {
        var initializer = this._initializers[i];

        if (initializer.instantiate) {
            initializer.instantiate(this);
        }
    }

    // Inject dependencies between objects.
    for (var i = 0; i < this._initializers.length; i++) {
        var initializer = this._initializers[i];

        if (initializer.inject) {
            initializer.inject(this, parameters);
        }
    }

    // Process.
    var modules = {
            'ajax-app': 'ajaxApp',
            'assets': 'assets',
            'command': 'command',
            'configuration': 'configuration',
            'dependency-injection': 'dependencyInjection',
            'sequencing': 'sequencing',
            'event': 'event',
            'file-system': 'fileSystem',
            'http': 'http',
            'manipulation': 'manipulation',
            'logging': 'logging',
            'object': 'object',
            'rendering': 'rendering',
            'tcp': 'tcp',
            'vendor': 'vendor'
        },
        danfConfig = {
            parameters: {},
        },
        isServer = 'undefined' === typeof danf,
        rootPath = '';
    ;

    if (isServer) {
        if ('test' !== context.environment) {
            danfConfig['assets'] = {
                'require.js': context.clientBuiltPath + '/require.js',
                'app.js': __dirname + '/../../client/app.js',
                'favicon.ico': __dirname + '/../../../resource/public/img/favicon.png',
                '-/danf/app': context.clientBuiltPath,
                '-/danf/config/common': __dirname + '/../../../config/common',
                '-/danf/config/client': __dirname + '/../../../config/client',
                '-/danf/lib/common': __dirname + '/..',
                '-/danf/lib/client': __dirname + '/../../client',
                '-/danf/resource': __dirname + '/../../../resource/public'
            };
        }
    } else {
        require('../../client/danf');

        var rootPos = module.id.indexOf('/lib/common/framework/framework');

        rootPath = module.id.substring(0, rootPos);
        if (rootPath) {
            rootPath += '/';
        }
    }

    for (var path in modules) {
        var name = modules[path],
            modulePrefix = 'danf:{0}'.format(name),
            pathPrefixes = isServer
                ? ['../../../config/common/{0}'.format(path), '../../../config/server/{0}'.format(path)]
                : ['{0}config/common/{1}'.format(rootPath, path), '{0}config/client/{1}'.format(rootPath, path)],
            moduleConfig = {
                'parameters': {},
                'interfaces': {},
                'services': {
                    'danf:utils': {
                        class: function() {
                            return utils;
                        }
                    }
                },
                'classes': {}
            },
            handleError = function(error, modulePath) {
                if (
                    (
                        -1 === error.message.indexOf('Cannot find module')
                        && -1 === error.message.indexOf('has not been loaded')
                    )
                    || -1 === error.message.indexOf(modulePath)
                ) {
                    throw error;
                }
            }
        ;

        for (var i = 0; i < pathPrefixes.length; i++) {
            var pathPrefix = pathPrefixes[i];

            // Handle parameters.
            try {
                var modulePath = '{0}/{1}'.format(pathPrefix, 'parameters'),
                    params = require(modulePath)
                ;

                if (moduleConfig['parameters'][modulePrefix]) {
                    params = utils.merge(params, moduleConfig['parameters'][modulePrefix], true);
                }
                moduleConfig['parameters'][modulePrefix] = params;
            } catch (error) {
                handleError(error, modulePath);
            }

            // Handle interfaces.
            try {
                var interfaces = {},
                    modulePath = '{0}/{1}'.format(pathPrefix, 'interfaces')
                ;

                interfaces[modulePrefix] = require('{0}/{1}'.format(pathPrefix, 'interfaces'));
                interfaces = utils.flatten(interfaces, 1);
                moduleConfig['interfaces'] = utils.merge(interfaces, moduleConfig['interfaces'], true);
            } catch (error) {
                handleError(error, modulePath);
            }

            // Handle classes.
            try {
                var classes = {},
                    modulePath = '{0}/{1}'.format(pathPrefix, 'classes')
                ;

                classes[modulePrefix] = require(modulePath);
                classes = utils.flatten(classes);
                moduleConfig['classes'] = utils.merge(classes, moduleConfig['classes'], true);
            } catch (error) {
                handleError(error, modulePath);
            }

            // Handle services.
            try {
                var services = {},
                    modulePath = '{0}/{1}'.format(pathPrefix, 'services')
                ;

                services[modulePrefix] = require('{0}/{1}'.format(pathPrefix, 'services'));
                services = utils.flatten(services, 1);
                moduleConfig['services'] = utils.merge(services, moduleConfig['services'], true);
            } catch (error) {
                handleError(error, modulePath);
            }

            // Handle sequences.
            try {
                var sequences = {},
                    modulePath = '{0}/{1}'.format(pathPrefix, 'sequences')
                ;

                sequences[modulePrefix] = require('{0}/{1}'.format(pathPrefix, 'sequences'));
                sequences = utils.flatten(sequences, 1);
                moduleConfig['sequences'] = utils.merge(sequences, moduleConfig['sequences'], true);
            } catch (error) {
                handleError(error, modulePath);
            }

            // Handle events.
            try {
                var modulePath = '{0}/{1}'.format(pathPrefix, 'events');

                moduleConfig['events'] = utils.merge(
                    require(modulePath),
                    moduleConfig['events']
                );
            } catch (error) {
                handleError(error, modulePath);
            }

            // Handle assets.
            try {
                var modulePath = '{0}/{1}'.format(pathPrefix, 'assets');

                moduleConfig['assets'] = utils.merge(
                    require(modulePath),
                    moduleConfig['assets']
                );
            } catch (error) {
                handleError(error, modulePath);
            }
        }

        danfConfig = utils.merge(danfConfig, moduleConfig, true);
    }

    var flowProvider = this.get('danf:manipulation.flowProvider'),
        parametersProcessor = this.get('danf:configuration.sectionProcessor.parameters')
    ;

    var flow = flowProvider.provide({
            id: 'framework',
            context: {
                getAll: function() { return {}; }
            },
            globalCatch: function(errors) {
                var error;

                if (1 === errors.length) {
                    error = errors[0];
                } else {
                    error = new Error('Framework initialization failed.');

                    error.embedded = [];
                }

                if (logger) {
                    logger.log(
                        '<<red>><<bold>>Framework initialization failed.',
                        1
                    );
                }

                var messages = [];

                for (var i = 0; i < errors.length; i++) {
                    if (logger) {
                        logger.log('<<red>>{0}'.format(errors[i].message), 1);
                        logger.log('<<grey>>{0}'.format(errors[i].stack), 2, 1);
                    }

                    messages.push(errors[i].message);

                    if (1 !== errors.length) {
                        error.embedded.push(errors[i]);
                    }
                }

                if (1 !== errors.length) {
                    error.message = messages.join('; ');
                }

                throw error;
            },
            callback: callback
        }),
        task = flow.wait()
    ;

    flow.__asyncFlow = flow;

    danfConfig = parametersProcessor.preProcess(danfConfig, utils.merge(danfConfig.parameters, {'danf:context': context}));
    danfConfig.classes = utils.flatten(danfConfig.classes);

    // Process initialization.
    for (var i = 0; i < this._initializers.length; i++) {
        var initializer = this._initializers[i];

        if (initializer.inject) {
            initializer.process(this, parameters, danfConfig, configuration);
        }
    }

    flow.end(task);
}