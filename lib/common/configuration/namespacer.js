'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new namespacer.
     */
    function Namespacer() {
        this._referenceTypes = {};
    }

    Namespacer.defineImplementedInterfaces(['danf:configuration.namespacer']);

    Namespacer.defineDependency('_referenceTypes', 'danf:manipulation.referenceType_object');

    /**
     * Set the reference types.
     *
     * @param {danf:manipulation.referenceType_object}
     * @api public
     */
    Object.defineProperty(Namespacer.prototype, 'referenceTypes', {
        set: function(referenceTypes) {
            this._referenceTypes = {};

            for (var i = 0; i < referenceTypes.length; i++) {
                this.addReferenceType(referenceTypes[i]);
            }
        }
    });

    /**
     * Add a reference type.
     *
     * @param {danf:manipulation.referenceType} referenceType The reference type.
     * @api public
     */
    Namespacer.prototype.addReferenceType = function(referenceType) {
        this._referenceTypes[referenceType.name] = referenceType;
    }

    /**
     * Get the reference type.
     *
     * @param {string} referenceType The reference type.
     * @api protected
     */
    Namespacer.prototype.getReferenceType = function(type) {
        if (this._referenceTypes[type]) {
            return this._referenceTypes[type];
        }

        throw new Error(
            'The reference type "{0}" is not defined.'.format(type)
        );
    }

    /**
     * @interface {danf:configuration.namespacer}
     */
    Namespacer.prototype.prefix = function (source, module, modulesTree) {
        var appNamespace = '{0}:'.format(modulesTree.appName),
            danfNamespace = 'danf:'
        ;

        if (
            // Already namespaced.
            source.substr(0, appNamespace.length) !== appNamespace
            // Danf framework.
            && source.substr(0, danfNamespace.length) !== danfNamespace
        ) {
            var namespacePos = source.lastIndexOf(':'),
                namespace = ''
            ;

            if (-1 !== namespacePos) {
                namespace = source.substr(0, namespacePos);
                source = source.substr(namespacePos + 1);
            }

            var child = modulesTree.getChild(module, namespace),
                prefix = child.alias ? child.alias : child.id
            ;


            if ('' === source) {
                source = prefix;
            } else {
                source = '{0}:{1}'.format(
                    prefix,
                    source
                );
            }
        }

        return source;
    }

    /**
     * @interface {danf:configuration.namespacer}
     */
    Namespacer.prototype.prefixReferences = function (source, type, module, modulesTree) {
        var referenceType = this.getReferenceType(type);

        if ('object' === typeof source) {
            for (var key in source) {
                source[key] = this.prefixReferences(source[key], type, module, modulesTree);
            }
        } else if ('string' === typeof source) {
            var delimiter = referenceType.delimiter,
                namespaces = referenceType.namespaces,
                splitSource = source.split(delimiter)
            ;

            if (referenceType.size >= 2) {
                if (source.length >= 2 &&
                    delimiter === source.substring(0, 1) &&
                    delimiter === source.substring(source.length - 1)
                ) {
                    var namespacesLength = namespaces.length;

                    for (var j = 0; j < namespaces.length; j++) {
                        var i = namespaces[j];

                        splitSource[i + 1] = this.prefix(splitSource[i + 1], module, modulesTree);
                    }
                }
            } else {
                var length = splitSource.length,
                    offset = 0
                ;

                for (var i = 0; i < length - 1; i++) {
                    // References of the source.
                    if (1 === (i + offset) % 2 && '' !== splitSource[i]) {
                        // Does not interpret it as a reference if there is a white space inside.
                        if (-1 === splitSource[i].indexOf(' ')) {
                            if (0 === namespaces[0]) {
                                splitSource[i] = this.prefix(splitSource[i], module, modulesTree);
                            }
                        } else {
                            offset++;
                        }
                    }
                }
            }

            source = splitSource.join(delimiter);
        }

        return source;
    }

    /**
     * Expose `Namespacer`.
     */
    return Namespacer;
});