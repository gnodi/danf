/*!
 * Danf
 * https://github.com/gnodi/danf
 *
 * Copyright 2014, 2015 Thomas Prelot and other contributors
 * Released under the MIT license
 */

require(
    [
        '../common/framework/framework',
        '../common/framework/initializer',
        '../../config/client/ajax-app/classes',
        '../../config/client/ajax-app/interfaces',
        '../../config/client/ajax-app/services',
        '../../config/client/ajax-app/events',
        '../../config/client/ajax-app/sequences',
        '../../config/common/configuration/interfaces',
        '../../config/common/configuration/services',
        '../../config/client/configuration/classes',
        '../../config/common/dependency-injection/interfaces',
        '../../config/common/dependency-injection/services',
        '../../config/client/dependency-injection/classes',
        '../../config/common/event/interfaces',
        '../../config/common/event/services',
        '../../config/client/event/classes',
        '../../config/client/event/services',
        '../../config/common/manipulation/interfaces',
        '../../config/common/manipulation/services',
        '../../config/client/manipulation/classes',
        '../../config/common/object/interfaces',
        '../../config/common/object/services',
        '../../config/client/object/classes',
        '../../config/common/http/interfaces',
        '../../config/client/http/classes',
        '../../config/client/http/services',
        '../../config/client/vendor/classes',
        '../../config/client/vendor/services'
    ]
    , function(
        Framework,
        Initializer
    ) {
        require(['_app'], function(configuration) {
            setTimeout(
                function() {
                    // Build framework.
                    var framework = new Framework(),
                        initializer = new Initializer(),
                        app = function() {}
                    ;

                    framework.addInitializer(initializer);
                    framework.set('danf:app', app);
                    framework.build(configuration, danf.context);

                    app.servicesContainer = app.objectsContainer;
                },
                10
            );
        });
    }
);