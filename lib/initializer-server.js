'use strict';

/**
 * Module dependencies.
 */
var defineStatic = require('./assets/middleware/static');

/**
 * Expose `Initializer`.
 */
module.exports = Initializer;

/**
 * Initialize a new framework.
 */
function Initializer() {
}

/**
 * Instantiate objects.
 *
 * @param {object} framework The framework.
 * @api public
 */
Initializer.prototype.instantiate = function(framework) {
}

/**
 * Inject dependencies between objects.
 *
 * @param {object} framework The framework.
 * @api public
 */
Initializer.prototype.inject = function(framework) {
}

/**
 * Process.
 *
 * @param {object} framework The framework.
 * @param {object} parameters The application parameters.
 * @param {object} danf The danf config.
 * @param {object} configuration The application danf configuration.
 * @api public
 */
Initializer.prototype.process = function(framework, parameters, danf, configuration) {
    var app = framework.get('danf:app'),
        config = parameters['config']
    ;

    // Define assets.
    var mapper = framework.get('danf:assets.mapper');
    mapper.processConfiguration(danf.assets || {});
    mapper.processConfiguration(config.assets || {});
    app.use(defineStatic(mapper));

    // Initialize the rendering.
    var jade = require('jade').__express;
    app.set('view engine', jade);
    app.engine('jade', jade);
}