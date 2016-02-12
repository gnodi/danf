'use strict';

var danf = {};

define(function(require) {
    var module = require('module');

    danf.context = module.config().context;

    require(['-/danf/app/jquery', '-/danf/app/init', '-/danf/app/config'], function() {
        require(['-/danf/app/danf']);
        require(['-/danf/app/app']);
    });
});