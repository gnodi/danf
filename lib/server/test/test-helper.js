'use strict';

/**
 * Module dependencies.
 */
var danf = require('../app'),
    utils = require('../../common/utils'),
    instances = {}
;

/**
 * Expose `TestHelper`.
 */
module.exports = TestHelper;

/**
 * Initialize a test helper.
 * Use TestHelper.get to instantiate a test helper.
 *
 * @param {object|string} configuration The danf server configuration.
 * @param {object} context The server application context.
 * @param {function} callback An optional callback to process before listening to requests.
 * @api private
 */
function TestHelper(configuration, context, callback) {
    context = utils.merge({environment: 'test', verbosity: 0}, context);

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
 * Get an existing test helper or create it.
 *
 * @param {object|string} configuration The danf server configuration.
 * @param {object} context The server application context.
 * @param {function} callback An optional callback to process before listening to requests.
 * @api public
 */
TestHelper.get = function(configuration, context, callback) {
    var hash = '';

    if ('string' !== typeof configuration) {
        hash += JSON.stringify(configuration);
    }

    if ('string' !== typeof context) {
        hash += JSON.stringify(context);
    }

    if ('function' === typeof callback) {
        hash += callback.toString();
    }

    hash = hash.split('').reduce(
        function(a,b) {
            a = ((a << 5) - a) + b.charCodeAt(0);

            return a & a;
        },
        0
    );

    if (undefined === instances[hash]) {
        instances[hash] = new TestHelper(configuration, context, callback);
    }

    return instances[hash];
}

/**
 * Get a class.
 *
 * @param {string} name The name of the class.
 * @return {function} The class.
 * @api public
 */
TestHelper.prototype.getClass = function(name) {
    return this.app.servicesContainer.get('danf:object.classesContainer').get(
        this.prefix(name)
    );
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