'use strict';

var danf = {};

define(function(require) {
    var module = require('module');

    danf.context = module.config().context;

    require(['-/danf/init'], function() {
        require(['-/danf/main']);
    });
});