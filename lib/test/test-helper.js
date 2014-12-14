'use strict';

/**
 * Module dependencies.
 */
var danf = require('../app'),
    utils = require('../utils')
;

/**
 * Expose `TestHelper`.
 */
module.exports = TestHelper;

/**
 * Initialize a test helper.
 *
 * @param {object} configuration The danf configuration of the application.
 */
function TestHelper(configuration, context, callback) {
    context = utils.merge({environment: 'test', silent: true}, context);

    var app = danf(configuration, context, callback),
        prefix = function(name) {
            var danfPrefix = 'danf:';

            if (danfPrefix === name.substr(0, danfPrefix.length)) {
                return name;
            }

            return '{0}:{1}'.format(app.context.app, name);
        },
        getClass = function(name) {
            return app.servicesContainer.get('danf:object.classesRegistry').get(prefix(name));
        }
    ;

    return {
        getClass: getClass,
        getInstance: function(name) {
            return new (getClass(name))();
        },
        getService: function(id) {
            return app.servicesContainer.get(prefix(id));
        },
        getApp: function() {
            return app;
        }
    }
}