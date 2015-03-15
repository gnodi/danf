'use strict';

requirejs.config({
    map: {
      '*': { 'jquery': '../../../lib/client/vendor/jquery' },
      '../../../lib/client/vendor/jquery': { 'jquery': 'jquery' }
    }
});

define(function(require) {
    return {
        jquery: {
            class: require('jquery')
        }
    };
})