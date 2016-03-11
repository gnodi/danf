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

process.on('uncaughtException', function(err) {
    process.exit(1);
});

/**
 * Initialize a test helper.
 * Use TestHelper.get to instantiate a test helper.
 *
 * @param {object|string} configuration The danf server configuration.
 * @param {object} context The server application context.
 * @api private
 */
function TestHelper(configuration, context) {
    this._configuration = configuration;
    this._context = utils.merge(
        {
            environment: 'test',
            cluster: null,
            verbosity: 5
        },
        context
    );
}

/**
 * Danf app builder.
 *
 * @var {object}
 * @api public
 */
Object.defineProperty(TestHelper, 'builder', {
    value: danf({}, {}, {}, {})
});

/**
 * Utils.
 *
 * @var {object}
 * @api public
 */
Object.defineProperty(TestHelper, 'utils', {
    value: utils
});

/**
 * Use an existing test helper or create it before use on test function.
 *
 * @param {object|string} configuration The danf server configuration.
 * @param {object} context The server application context.
 * @param {function} test The test function.
 * @api public
 */
TestHelper.use = function(configuration, context, test) {
    Object.checkType(test, 'function');

    if (null == configuration) {
        configuration = 'auto';
    }
    if (null == context) {
        context = {};
    }

    // Build helper hash from configuration and context
    // to have only one helper for a configuration and context
    // in order to avoid creating a helper for each test.
    var hash = '';

    if ('string' !== typeof configuration) {
        hash += JSON.stringify(configuration);
    }
    if ('string' !== typeof context) {
        hash += JSON.stringify(context);
    }

    hash = hash.split('').reduce(
        function(a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);

            return a & a;
        },
        0
    );

    // Create a test helper if no helper exists for this hash.
    if (undefined === instances[hash]) {
        instances[hash] = new TestHelper(configuration, context);
    }

    // Use test helper on test function.
    use.call(instances[hash], test);
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
        prefix.call(this, name)
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
    return this.app.servicesContainer.get(prefix.call(this, id));
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

/**
 * Test an asynchronous process.
 *
 * @param {function} process The asynchronous process.
 * @param {function} assert The callback to process at the end of the asynchronous process.
 * @param {function} catch_ The callback to process if an error occured during the asynchronous process.
 * @api public
 */
TestHelper.prototype.testAsync = function(process, assert, catch_) {
    var errored = false,
        assertWrapper = function(result) {
            if (!errored && assert) {
                assert(null, result);
            }
        },
        mapProvider = this.getService('danf:manipulation.mapProvider'),
        contextMap = mapProvider.provide({name: 'flow'}),
        flowProvider = this.getService('danf:manipulation.flowProvider'),
        flow = flowProvider.provide({
            stream: {},
            initialScope: '.',
            globalCatch: function(errors) {
                errored = true;

                var error;

                if (1 === errors.length) {
                    error = errors[0];
                } else {
                    error = new Error();

                    error.embedded = errors;

                    var messages = [];

                    for (var i = 0; i < errors.length; i++) {
                        messages.push(errors[i].message);
                    }

                    error.message = messages.join('; ');
                }

                var result = error;

                if (catch_) {
                    try {
                        var result = catch_(error);

                        if (assert) {
                            assert(null, result);
                        }
                    } catch (error) {
                        if (assert) {
                            assert(error);
                        }
                    }
                } else if (assert) {
                    assert(error);
                }
            },
            context: contextMap,
            callback: assertWrapper
        })
    ;

    this.__asyncFlow = flow;

    this.__asyncProcess(function(async) {
        process.call(this, async);
    });
}

/**
 * Prefix a name with its namespace base.
 *
 * @param {string} The name
 */
var prefix = function(name) {
    if (/^danf:/.test(name)) {
        return name;
    }

    var appBaseNamespace = new RegExp(
            '^{0}:'.format(this.app.context.app)
        )
    ;

    if (appBaseNamespace.test(name)) {
        return name;
    }

    return '{0}:{1}'.format(this.app.context.app, name);
}

/**
 * Use the test helper on a test function.
 *
 * @param {function} test The test function.
 */
var use = function(test) {
    if (undefined === this.app) {
        var self = this;

        this.app = danf(this._configuration, '', this._context, {}).buildServer(
            function(app) {
                self.app = app;
                test(self);

                if ('function' === typeof run) {
                    run();
                }
            }
        );
    } else {
        test(this);
    }
}