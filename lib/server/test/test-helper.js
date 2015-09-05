'use strict';

/**
 * Module dependencies.
 */
var danf = require('../app'),
    utils = require('../../common/utils')
;

/**
 * Expose `TestHelper`.
 */
module.exports = TestHelper;

/**
 * Initialize a test helper.
 *
 * @param {object|string} configuration The danf server configuration.
 * @param {object} context The server application context.
 * @param {function} callback An optional callback to process before to listen to requests.
 */
function TestHelper(configuration, context, callback) {
    context = utils.merge({environment: 'test', silent: true}, context);

    this.app = danf(configuration, '', context, {}, callback);
    this.prefix = function(name) {
        var danfPrefix = 'danf:';

        if (danfPrefix === name.substr(0, danfPrefix.length)) {
            return name;
        }

        return '{0}:{1}'.format(this.app.context.app, name);
    };
}

/**
 * Get a class.
 *
 * @param {string} name The name of the class.
 * @return {function} The class.
 * @api public
 */
TestHelper.prototype.getClass = function(name) {
    return this.app.servicesContainer.get('danf:object.classesRegistry').get(this.prefix(name));
}

/**
 * Get an instance of a class.
 *
 * @param {string} name The name of the class.
 * @return {object} The instance.
 * @api public
 */
TestHelper.prototype.getInstance = function(name) {
    return new (this.getClass(name))();
}

/**
 * Get a service.
 *
 * @param {string} id The id of the service.
 * @return {object} The service.
 * @api public
 */
TestHelper.prototype.getService = function(id) {
    return this.app.servicesContainer.get(this.prefix(id));
}

/**
 * Get the test app.
 *
 * @return {object} The test app.
 * @api public
 */
TestHelper.prototype.getApp = function() {
    return this.app;
}