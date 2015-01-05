'use strict';

var requirejs = require,
    require = function(path, callback) {
        if ('object' === typeof path) {
            if (callback) {
                requirejs(path, callback);
            } else {
                requirejs(path);
            }
        } else {
            if (callback) {
                requirejs([path], callback);
            } else {
                requirejs([path]);
            }
        }
    },
    module = {
        isClient: true
    }
;

define(function(require) {
    var init = require('danf/init'),
        module = require('module'),
        configuration = require('danf-client'),
        Framework = require('danf/framework'),
        Initializer = require('danf/initializer')
    ;

    // Build framework.
    var framework = new Framework(),
        initializer = new Initializer(),
        context = module.config().context,
        app = function() {},
        requiredModules = []
    ;

    app.context = context;

    for (var i = 0; i < context.modules.length; i++) {
        var moduleId = context.modules[i];

        switch (moduleId) {
            case 'ajax-app':
                requiredModules.push('danf/config/ajax-app/client/parameters');
                requiredModules.push('danf/config/ajax-app/client/interfaces');
                requiredModules.push('danf/config/ajax-app/client/services');
                requiredModules.push('danf/config/ajax-app/client/events');
                requiredModules.push('danf/config/ajax-app/client/sequences');

                break;
            case 'configuration':
                requiredModules.push('danf/config/configuration/interfaces');
                requiredModules.push('danf/config/configuration/services');
                requiredModules.push('danf/config/configuration/client/parameters');

                break;
            case 'dependency-injection':
                requiredModules.push('danf/config/dependency-injection/interfaces');
                requiredModules.push('danf/config/dependency-injection/services');
                requiredModules.push('danf/config/dependency-injection/client/parameters');

                break;
            case 'event':
                requiredModules.push('danf/config/event/interfaces');
                requiredModules.push('danf/config/event/services');
                requiredModules.push('danf/config/event/client/parameters');
                requiredModules.push('danf/config/event/client/services');

                break;
            case 'manipulation':
                requiredModules.push('danf/config/manipulation/interfaces');
                requiredModules.push('danf/config/manipulation/services');
                requiredModules.push('danf/config/manipulation/client/parameters');

                break;
            case 'object':
                requiredModules.push('danf/config/object/interfaces');
                requiredModules.push('danf/config/object/services');
                requiredModules.push('danf/config/object/client/parameters');

                break;
            case 'http':
                requiredModules.push('danf/config/http/interfaces');
                requiredModules.push('danf/config/http/client/parameters');
                requiredModules.push('danf/config/http/client/services');

            case 'vendor':
                requiredModules.push('danf/config/vendor/client/parameters');
                requiredModules.push('danf/config/vendor/client/services');

                break;
        }
    }

    require(requiredModules, function() {
        framework.addInitializer(initializer);
        framework.set('danf:app', app);
        framework.build(configuration, context);

        app.servicesContainer = app.objectsContainer;
    });
});