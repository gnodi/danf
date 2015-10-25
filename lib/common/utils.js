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

        var mergedObj = Array.isArray(obj1) ? [] : {};

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
                        if (null == value || 'object' !== typeof value || value.__metadata || value instanceof Date || value instanceof RegExp || value instanceof RegExp) {
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
    },

    /**
     * Clone an object.
     * (credits to A. Levy [http://stackoverflow.com/users/35881/a-levy])
     *
     * @param {object} object The object to clone.
     * @return {object} The cloned object.
     * @api public
     */
    clone: function(object, clonedObjects) {
        // Handle the 3 simple types, and null or undefined.
        if (null == object || 'object' !== typeof object) {
            return object;
        }

        // Handle Date.
        if (object instanceof Date) {
            var clone = new Date();

            clone.setTime(object.getTime());

            return clone;
        }

        // Handle Array.
        if (object instanceof Array) {
            var clone = [];

            for (var i = 0, len = object.length; i < len; i++) {
                clone[i] = utils.clone(object[i], clonedObjects);
            }

            return clone;
        }

        // Handle objects.
        if (!clonedObjects) {
            clonedObjects = []
        }

        var index = clonedObjects.indexOf(object);

        // Handle circular references.
        if (index !== -1) {
            return clonedObjects[index];
        }

        clonedObjects.push(object);

        var clone = Object.create(Object.getPrototypeOf(object));

        for (var attr in object) {
            try {
                if (object.hasOwnProperty) {
                    if (object.hasOwnProperty(attr)) {
                        clone[attr] = utils.clone(object[attr], clonedObjects);
                    }
                } else {
                    clone[attr] = utils.clone(object[attr], clonedObjects);
                }
            } catch (error) {
                // Do not copy inaccessible property.
            }
        }

        return clone;
    },

    /**
     * Extend objects or classes.
     *
     * @param {object|Function} extended The object or class to extend.
     * @param {object|Function} extender The extender.
     * @return {object} The extended object or child class.
     * @api public
     */
    extend: function(extended, extender) {
        if (extended && extender) {
            if (typeof extended === 'function' && typeof extender === 'function') {
                var prototype = extender.prototype;

                extender.prototype = Object.create(extended.prototype);

                // Merge already defined methods.
                for (var key in prototype) {
                    if (extender.hasOwnProperty(key)) {
                        extender.prototype[key] = prototype[key];
                    }
                }

                // Merge already defined properties.
                var propertyNames = Object.getOwnPropertyNames(prototype);

                for (var i = 0; i < propertyNames.length; i++) {
                    var name = propertyNames[i];

                    if ('constructor' !== name) {
                        var descriptor = Object.getOwnPropertyDescriptor(prototype, name);

                        Object.defineProperty(extender.prototype, name, descriptor);
                    }
                }

                extender.prototype.constructor = extender;

                // Inherit interfaces implementation.
                if (!extender.__metadata.implements) {
                    extender.__metadata.implements = [];
                }

                var implementedInterfaces = extender.__metadata.implements.concat(extended.__metadata.implements || []),
                    uniqueImplementedInterfaces = []
                ;

                for (var i = 0; i < implementedInterfaces.length; i++) {
                    if (-1 == uniqueImplementedInterfaces.indexOf(implementedInterfaces[i])) {
                        uniqueImplementedInterfaces.push(implementedInterfaces[i]);
                    }
                }

                extender.__metadata.implements = uniqueImplementedInterfaces;

                // Inherit dependencies.
                if (!extender.__metadata.dependencies) {
                    extender.__metadata.dependencies = {};
                }

                extender.__metadata.dependencies = utils.merge(
                    extended.__metadata.dependencies,
                    extender.__metadata.dependencies
                );

                extender.Parent = extended;

                return extender;
            } else {
                throw new Error('Unable to extend a "' + typeof extended + '" with a "' + typeof extender + '".');
            }
        } else if (extender) {
            extended = extender;
        }

        return extended;
    },

    /**
     * Flatten an object containing embedded objects.
     *
     * Example:
     *     {
     *         a: {
     *             a: {
     *                 a: 2,
     *                 b: 3
     *             },
     *             b: 4,
     *         },
     *         foo: 'bar'
     *     }
     *     is transformed in:
     *     {
     *         'a.a.a': 2,
     *         'a.a.b': 3,
     *         'a.b': 4,
     *         foo: 'bar'
     *     }
     *
     * @param {object} object The object to flatten.
     * @param {number} maxLevel The max level of flattening.
     * @param {string} separator The flattening separator (default ".").
     * @param {number} level The embedded level.
     * @api public
     */
    flatten: function(object, maxLevel, separator, level) {
        var flattenedObject = object;

        if (!level) {
            Object.checkType(object, 'object');
            flattenedObject = utils.clone(object);
            level = 0;
        }

        if (!maxLevel || level < maxLevel) {
            for (var key in flattenedObject) {
                var value = flattenedObject[key],
                    flattenObject = {}
                ;

                if ('object' === typeof value && null !== value) {
                    var embeddedObject = utils.flatten(value, maxLevel, separator, level + 1);

                    for (var flattenKey in embeddedObject) {
                        flattenedObject['{0}{1}{2}'.format(key, separator || '.', flattenKey)] = embeddedObject[flattenKey];
                    }

                    delete flattenedObject[key];
                }
            }
        }

        return flattenedObject;
    },

    /**
     * Clone an object and clean it from its operating properties.
     *
     * @param {object} object The object.
     * @param {boolean} clone Whether or not to clone the object.
     * @api public
     */
    clean: function(object, clone) {
        if (false !== clone) {
            object = utils.clone(object);
        }

        for (var key in object) {
            if ('__' === key.substr(0, 2)) {
                delete object[key];
            } else {
                var value = object[key];

                if ('object' === typeof value) {
                    object[key] = utils.clean(value, false);
                }
            }
        }

        return object;
    },

    /**
     * Stringify an object.
     *
     * @param {mixed} object The object.
     * @param {string} The stringified object.
     * @api public
     */
    stringify: function(object) {
        var string;

        try {
            string = JSON.stringify(object);
        } catch (error) {
            string = '...';
        }

        return string;
    }
};

/**
 * Expose `utils`.
 */
module.exports = utils;
