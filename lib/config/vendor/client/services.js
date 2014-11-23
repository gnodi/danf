'use strict';

requirejs.config({
    map: {
      '*': { 'jquery': 'danf/vendor/jquery' },
      'danf/vendor/jquery': { 'jquery': 'jquery' }
    }
});

define(function(require) {
    return {
        jquery: {
            class: require('jquery')
        }
    };
})