'use strict';

var danf = {};

define(function(require) {
    var module = require('module');

    danf.context = module.config().context;

    require(['-/danf/lib/common/init'], function() {
        require(['-/danf'], function(configuration) {
            danf.configuration = configuration;

            require(['-/danf/main']);
        });
    });
});