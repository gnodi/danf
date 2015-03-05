'use strict';

requirejs.config({
    map: {
      '*': { 'jquery': '-/danf/lib/client/vendor/jquery' },
      '-/danf/lib/client/vendor/jquery': { 'jquery': 'jquery' }
    }
});

define(function(require) {
    return {
        jquery: {
            class: require('jquery')
        }
    };
})