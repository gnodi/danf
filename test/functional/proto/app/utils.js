'use strict';

var utils = {
    /**
     * Merge an object with one or many other objects.
     * Recursivity disabled by default.
     * objN+1 overwrite simple values of objN.
     * You can merge N objects. Recursivity is always the last (optional) argument.
     *
     *     var obj1 = {a: 'abc'},
     *         obj2 = {b: 'bcd'},
     *         obj3 = {b: 'efg'}
     *     ;
     *
     *     var obj = utils.merge(obj1, obj2, obj3);
     *     // obj == { a: 'abc', b: 'efg' }
     *
     * @param {object} obj1 The first object.
     * @param {object} obj2 The second object.
     * @param {object} objN The n-th object.
     * @param {boolean|integer} recursively Whether or not the merge is recursive? True for infinite recursivity, an integer to limit the recursivity.
     * @return {object} The merged object.
     * @api public
     */
    merge: function(obj1, obj2, objN, recursively) {
        var argumentsNumber = arguments.length,
            objects = [],
            recursively = false
        ;

        for (var i = 0; i < arguments.length; i++) {
            objects[i] = arguments[i]
        }

        var mergedObj = {};

        if ('object' !== typeof arguments[argumentsNumber - 1] && argumentsNumber >= 3) {
            recursively = arguments[argumentsNumber - 1];
            objects.pop();
        }

        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];

            if (object) {
                for (var key in object) {
                    var value = object[key];

                    if (mergedObj[key] && recursively) {
                        if (null == value || 'object' !== typeof value || value.__metadata || value instanceof Date) {
                            mergedObj[key] = value;
                        } else if ('number' === typeof recursively) {
                            mergedObj[key] = utils.merge(mergedObj[key], value, recursively - 1);
                        } else {
                            mergedObj[key] = utils.merge(mergedObj[key], value, recursively);
                        }
                    } else {
                        mergedObj[key] = value;
                    }
                }
            }
        }

        return mergedObj;
    }
};

/**
 * Expose `utils`.
 */
module.exports = utils;
