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
    var init = require('-/danf/init'),
        module = require('module'),
        configuration = require('danf-client'),
        Framework = require('-/danf/framework'),
        Initializer = require('-/danf/initializer')
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
                requiredModules.push('-/danf/config/client/ajax-app/classes');
                requiredModules.push('-/danf/config/client/ajax-app/interfaces');
                requiredModules.push('-/danf/config/client/ajax-app/services');
                requiredModules.push('-/danf/config/client/ajax-app/events');
                requiredModules.push('-/danf/config/client/ajax-app/sequences');

                break;
            case 'configuration':
                requiredModules.push('-/danf/config/common/configuration/interfaces');
                requiredModules.push('-/danf/config/common/configuration/services');
                requiredModules.push('-/danf/config/client/configuration/classes');

                break;
            case 'dependency-injection':
                requiredModules.push('-/danf/config/common/dependency-injection/interfaces');
                requiredModules.push('-/danf/config/common/dependency-injection/services');
                requiredModules.push('-/danf/config/client/dependency-injection/classes');

                break;
            case 'event':
                requiredModules.push('-/danf/config/common/event/interfaces');
                requiredModules.push('-/danf/config/common/event/services');
                requiredModules.push('-/danf/config/client/event/classes');
                requiredModules.push('-/danf/config/client/event/services');

                break;
            case 'manipulation':
                requiredModules.push('-/danf/config/common/manipulation/interfaces');
                requiredModules.push('-/danf/config/common/manipulation/services');
                requiredModules.push('-/danf/config/client/manipulation/classes');

                break;
            case 'object':
                requiredModules.push('-/danf/config/common/object/interfaces');
                requiredModules.push('-/danf/config/common/object/services');
                requiredModules.push('-/danf/config/client/object/classes');

                break;
            case 'http':
                requiredModules.push('-/danf/config/common/http/interfaces');
                requiredModules.push('-/danf/config/client/http/classes');
                requiredModules.push('-/danf/config/client/http/services');

            case 'vendor':
                requiredModules.push('-/danf/config/client/vendor/classes');
                requiredModules.push('-/danf/config/client/vendor/services');

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