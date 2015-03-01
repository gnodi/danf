'use strict';

requirejs.config({
    map: {
      '*': { 'jquery': 'danf/client/vendor/jquery' },
      'danf/client/vendor/jquery': { 'jquery': 'jquery' }
    }
});

define(function(require) {
    return {
        jquery: {
            class: require('jquery')
        }
    };
})