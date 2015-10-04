'use strict';

var jq = require('jquery');

module.exports = function() {
    var $ = jq.noConflict(true);

    // Add method to apply another method on a set of elements.
    $.do = function(elements, method, args) {
        var args = Array.prototype.slice.call(arguments, 3);

        elements[method].apply(elements, args);
    }

    return $;
};