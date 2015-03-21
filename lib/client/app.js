'use strict';

var danf = {};

define(function(require) {
    var init = require('-/danf/lib/common/init'),
        module = require('module')
    ;

    danf.configuration = require('-/danf');
    danf.context = module.config().context;

    require('-/danf/main');
});