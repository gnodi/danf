'use strict';

var danf = {};

define(function(require) {
    var module = require('module');

    danf.context = module.config().context;

    require(['-/danf/bin/init', '-/danf/bin/config'], function() {
        require(['-/danf/bin/jquery']);
        require(['-/danf/bin/danf']);
        require(['-/danf/bin/app']);
    });
});