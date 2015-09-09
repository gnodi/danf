'use strict';

/**
 * Expose `ReferenceResolver`.
 */
module.exports = ReferenceResolver;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new reference resolver.
 */
function ReferenceResolver() {
    this._referenceTypes = {};
}

ReferenceResolver.defineImplementedInterfaces(['danf:manipulation.referenceResolver']);

ReferenceResolver.defineDependency('_referenceTypes', 'danf:manipulation.referenceType_object');

/**
 * Set the reference types.
 *
 * @param {danf:manipulation.referenceType_object}
 * @api public
 */
Object.defineProperty(ReferenceResolver.prototype, 'referenceTypes', {
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
ReferenceResolver.prototype.addReferenceType = function(referenceType) {
    this._referenceTypes[referenceType.name] = referenceType;
}

/**
 * Get the reference type.
 *
 * @param {string} referenceType The reference type.
 * @api protected
 */
ReferenceResolver.prototype.getReferenceType = function(type) {
    if (this._referenceTypes[type]) {
        return this._referenceTypes[type];
    }

    throw new Error(
        'The reference type "{0}" is not defined.'.format(type)
    );
}

/**
 * @interface {danf:manipulation.referenceResolver}
 */
ReferenceResolver.prototype.extract = function(source, type, inText) {
    var referenceType = this.getReferenceType(type),
        delimiter = referenceType.delimiter
    ;

    if (referenceType.allowsConcatenation) {
        throw new Error(
            'The reference of the source "{0}"{1} cannot be extracted because the type "{2}" allows concatenation.'.format(
                source,
                inText ? ' declared in {0}'.format(inText) : '',
                type
            )
        );
    }

    if (source.length >= 2 &&
        delimiter === source.substring(0, 1) &&
        delimiter === source.substring(source.length - 1)
    ) {
        var extraction = source.substring(1, source.length - 1).split(delimiter);

        if (extraction.length <= referenceType.size) {
            // Complete undefined values.
            for (var i = 0; i < referenceType.size; i++) {
                if (undefined === extraction[i]) {
                    extraction[i] = '';
                }
            };

            return extraction;
        } else if (extraction.length > referenceType.size) {
            throw new Error(
                'The reference of the source "{0}"{1} cannot be extracted because the type "{2}" define a size of "{3}" which is inferior to the size of the found reference ({4}).'.format(
                    source,
                    inText ? ' declared in {0}'.format(inText) : '',
                    type,
                    referenceType.size,
                    extraction.length
                )
            );
        }
    }

    return;
}

/**
 * @interface {danf:manipulation.referenceResolver}
 */
ReferenceResolver.prototype.resolve = function(source, type, context, inText) {
    var referenceType = this.getReferenceType(type),
        delimiter = referenceType.delimiter,
        splitSource = source.split(
            new RegExp('{0}(?!\\\\)'.format(delimiter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')), 'g')
        ),
        length = splitSource.length
    ;

    if (referenceType.size !== 1) {
        throw new Error(
            'The references in source "{0}"{1} cannot be resolved because the size of the type "{2}" is greater than 1.'.format(
                source,
                inText ? ' declared in {0}'.format(inText) : '',
                type
            )
        );
    }

    if (length <= 2) {
        return source;
    }

    var references = [],
        isArray = false,
        concatenate = !(
            delimiter === source.substring(0, 1) &&
            delimiter === source.substring(source.length - 1) &&
            3 === length
        )
    ;

    // This is not a concatenation.
    if (!concatenate) {
        var resolvedReferences = resolveReferences([splitSource[1]], context, true);

        if (resolvedReferences && Array.isArray(resolvedReferences.items) && 1 === resolvedReferences.items.length) {
            return resolvedReferences.items[0];
        }

        throw new Error(
            'The reference "{0}{1}{0}" in source "{2}"{3} cannot be resolved in the context "{4}".'.format(
                delimiter,
                splitSource[1],
                source,
                inText ? ' declared in {0}'.format(inText) : '',
                JSON.stringify(context)
            )
        );
    // This is a concatenation.
    } else if (referenceType.allowsConcatenation) {
        var independentReferences = {},
            contextReferences = [],
            offset = 0
        ;

        // Resolve independent and context references.
        for (var i = 0; i < length - 1; i++) {
            // References of the source.
            if (1 === (i + offset) % 2 && '' !== splitSource[i]) {
                // Does not interpret it as a reference if there is a white space inside.
                if (-1 === splitSource[i].indexOf(' ')) {
                    if (
                        '`' === splitSource[i].substring(0, 1) &&
                        '`' === splitSource[i].substring(splitSource[i].length - 1)
                    ) {
                        var independentSource = splitSource[i].substring(1, splitSource[i].length - 1),
                            independentResolvedReferences = resolveReferences([independentSource], context)
                        ;

                        if (undefined === independentResolvedReferences) {
                            throw new Error(
                                'The reference "{0}{1}{0}" in source "{2}"{3} cannot be resolved.'.format(
                                    delimiter,
                                    splitSource[i],
                                    source,
                                    inText ? ' declared in {0}'.format(inText) : ''
                                )
                            );
                        }

                        isArray = (isArray || independentResolvedReferences.isArray);
                        independentReferences[i] = [];

                        for (var j = 0; j < independentResolvedReferences.items.length; j++) {
                            independentReferences[i].push(independentResolvedReferences.items[j][0]);
                        }
                    } else {
                        contextReferences[i] = splitSource[i];
                    }
                } else {
                    offset++;
                }
            }
        }

        if (0 === contextReferences.length && 0 === independentReferences.length) {
                return source;
        }

        // Merge context and independant references.
        var resolvedReferences = resolveReferences(contextReferences, context),
            mergedReferences = []
        ;

        if (undefined === resolvedReferences) {
            var realReferences = [];

            for (var index = 0; index < contextReferences.length; index++) {
                if (contextReferences[index]) {
                    realReferences.push(contextReferences[index]);
                }
            }

            throw new Error(
                'One of the references "{0}{1}{0}" in source "{2}"{3} cannot be resolved.'.format(
                    delimiter,
                    realReferences.join('{0}", "{0}'.format(delimiter)),
                    source,
                    inText ? ' declared in {0}'.format(inText) : ''
                )
            );
        }

        isArray = (isArray || resolvedReferences.isArray);

        // Merge independent references.
        if (0 !== independentReferences.length) {
            var independentReferencesProduct = [];

            for (var key in independentReferences) {
                if (0 === independentReferencesProduct.length) {
                    for (var j = 0; j < independentReferences[key].length; j++) {
                        var independentReference = {};

                        independentReference[key] = independentReferences[key][j];
                        independentReferencesProduct.push(independentReference);
                    }
                } else {
                    var independentReferencesMiddleProduct = [];

                    for (var j = 0; j < independentReferences[key].length; j++) {
                        for (var k = 0; k < independentReferencesProduct.length; k++) {
                            var independentReference = utils.clone(independentReferencesProduct[k]);

                            independentReference[key] = independentReferences[key][j];
                            independentReferencesMiddleProduct.push(independentReference);
                        }
                    }

                    independentReferencesProduct = independentReferencesMiddleProduct;
                }
            }

            for (var j = 0; j < independentReferencesProduct.length; j++) {
                var mergedReference = [];

                for (var index = 0; index < splitSource.length; index++) {
                    mergedReference[index] = independentReferencesProduct[j][index];
                }

                mergedReferences.push(mergedReference);
            }
        }

        // There are context references only.
        if (0 === mergedReferences.length) {
            mergedReferences = resolvedReferences.items;
        // Merge independent and context references.
        } else if (0 !== contextReferences.length) {
            var contextReferences = resolvedReferences.items,
                referencesProduct = []
            ;

            for (var i = 0; i < mergedReferences.length; i++) {
                for (var j = 0; j < contextReferences.length; j++) {
                    var mergedReference = [],
                        length = Math.max(mergedReferences[i].length, contextReferences[j].length)
                    ;

                    for (var k = 0; k < length; k++) {
                        if (undefined !== mergedReferences[i][k]) {
                            mergedReference[k] = mergedReferences[i][k];
                        } else {
                            mergedReference[k] = contextReferences[j][k];
                        }
                    }

                    referencesProduct.push(mergedReference);
                }
            }

            mergedReferences = referencesProduct;
        }

        var offset = 0;

        // Split and concatenate references.
        for (var i = 0; i < length; i++) {
            var isReference = true;

            // References of the source.
            if (i < length - 1 && 1 === (i + offset) % 2 && '' !== splitSource[i]) {
                // Does not interpret it as a reference if there is a white space inside.
                if (-1 === splitSource[i].indexOf(' ')) {
                    // Concatenate to the other parts of the source.
                    var referencesArray = [];

                    for (var index in mergedReferences) {
                        var reference = mergedReferences[index][i],
                            isBuilt = mergedReferences.length === references.length
                        ;

                        for (var key in references) {
                            if (!isBuilt || key === index) {
                                referencesArray[index] = references[key] + reference;
                            }
                        }
                    }

                    references = referencesArray;
                } else {
                    offset++;
                    isReference = false;
                }
            }

            // Other parts of the source (references of reference and other parts).
            if (i >= length - 1 || 1 !== (i + offset) % 2 || '' === splitSource[i]) {
                var sourcePart = 1 !== (i + offset) % 2 ? splitSource[i] : delimiter;
                // Source part contain a white space.
                sourcePart = !isReference ? delimiter + splitSource[i] : sourcePart;
                // Last part of the source.
                sourcePart = i >= length - 1 && 1 === (i + offset) % 2 ? sourcePart + splitSource[i] : sourcePart;

                if (0 === references.length) {
                    references.push(sourcePart);
                } else {
                    for (var index = 0; index < references.length; index++) {
                        references[index] += sourcePart;
                    }
                }
            }
        }

        if (!isArray && 1 === references.length) {
            return references[0];
        }

        return references;
    }

    throw new Error(
        'The references in source "{0}"{1} cannot be resolved because the type "{2}" does not allow concatenation.'.format(
            source,
            inText ? ' declared in {0}'.format(inText) : '',
            type
        )
    );
}

/**
 * Resolve references for a context.
 *
 * @param {Array} references The references.
 * @param {Object} context The context.
 * @param {Boolean} simple Is this a simple reference?
 * @return {Array} The resolved reference.
 * @api private
 */
var resolveReferences = function(references, context, simple) {
    var referencesTree = { branch: {} };

    for (var i = 0; i < references.length; i++) {
        var reference = references[i];

        if (null != reference) {
            var splitReference = '.' !== reference ? reference.split('.') : ['.'],
                branch = referencesTree
            ;

            for (var j = 0; j < splitReference.length; j++) {
                if (!branch.branch[splitReference[j]]) {
                    branch.branch[splitReference[j]] = { branch: {} };
                }

                branch = branch.branch[splitReference[j]];
            }

            if (!Array.isArray(branch.references)) {
                branch.references = [];
            }
            branch.references.push(i);
        }
    }

    return resolveBranchReferences(referencesTree, context, simple);
}

/**
 * Resolve references of a branch for a context.
 *
 * @param {Array} branch A branch of references.
 * @param {Object} context The context.
 * @param {Boolean} simple Is this a simple reference?
 * @return {Array} The resolved references.
 * @api private
 */
var resolveBranchReferences = function(branch, context, simple) {
    var references = { items: [], isArray: false },
        branchesReferences = { items: [], isArray: false },
        branchKeyReferences = {}
    ;

    // Fill the references.
    if (Array.isArray(branch.references)) {
        if (simple) {
            if (undefined !== context) {
                for (var i = 0; i < branch.references.length; i++) {
                    references.items[branch.references[i]] = context;
                    references.isArray = 'object' === typeof context;
                }
            } else {
                return;
            }
        } else {
            if ('object' === typeof context) {
                for (var key in context) {
                    if (Array.isArray(context[key])) {
                        for (var i = 0; i < context[key].length; i++) {
                            var branchReferences = [];

                            for (var j = 0; j < branch.references.length; j++) {
                                branchReferences[branch.references[j]] = context[key][i];
                            }

                            references.items.push(branchReferences);
                        }
                    } else {
                        var branchReferences = [];

                        for (var i = 0; i < branch.references.length; i++) {
                            if ('object' === typeof context[key] && !Array.isArray(context[key])) {
                                branchReferences[branch.references[i]] = key;
                            } else {
                                branchReferences[branch.references[i]] = context[key];
                            }
                        }

                        references.items.push(branchReferences);
                    }

                    references.isArray = true;
                }
            } else if (undefined !== context) {
                var branchReferences = [];

                for (var i = 0; i < branch.references.length; i++) {
                    branchReferences[branch.references[i]] = context;
                }

                references.items.push(branchReferences);
            } else {
                return;
            }
        }
    }

    // Check and merge references for the branches.
    for (var propertyName in branch.branch) {
        if ('.' === propertyName) {
            var branchReferences = resolveBranchBranchesReferences(
                context,
                branch.branch[propertyName],
                simple
            );

            // Cannot resolve the references.
            if (undefined === branchReferences) {
                return;
            }

            branchesReferences = mergeBranchReferences(branchesReferences, branchReferences);
        }
        else if (undefined !== context[propertyName]) {
            var branchReferences = resolveBranchBranchesReferences(
                context[propertyName],
                branch.branch[propertyName],
                simple
            );

            // Cannot resolve the references.
            if (undefined === branchReferences) {
                return;
            }

            branchesReferences = mergeBranchReferences(branchesReferences, branchReferences);
        } else if ('object' === typeof context) {
            var hasReference = false;

            for (var key in context) {
                if (context[key]) {
                    var referenceValue = context[key][propertyName];

                    if (undefined !== referenceValue) {
                        var branchReferences = resolveBranchBranchesReferences(
                            context[key][propertyName],
                            branch.branch[propertyName],
                            simple
                        );

                        // Cannot resolve the references.
                        if (undefined === branchReferences) {
                            return;
                        }

                        if (!branchKeyReferences[key]) {
                            branchKeyReferences[key] = { items: [], isArray: false };
                        }

                        branchKeyReferences[key] = mergeBranchReferences(branchKeyReferences[key], branchReferences);
                        hasReference = true;
                    }
                }
            }

            // Cannot resolve the references.
            if (!hasReference) {
                return;
            }
        }
    }

    if (0 === branchesReferences.items.length) {
        for (var key in branchKeyReferences) {
            branchesReferences.items.push(branchKeyReferences[key]);
            branchesReferences.isArray = (branchesReferences.isArray || branchKeyReferences[key].isArray);
        }

        if (0 !== references.items.length && 0 !== branchesReferences.items.length) {
            var mergedReferences = { items: [], isArray: false };

            references.isArray = (references.isArray || branchesReferences.isArray);

            for (var i = 0; i < references.items.length; i++) {
                var referenceLength = references.items[i].length;

                for (var j = 0; j < branchesReferences.items[i].items.length; j++) {
                    var refValues = branchesReferences.items[i].items[j],
                        mergedReference = []
                    ;

                    for (var k = 0; k < referenceLength; k++) {
                        if (undefined !== references.items[i][k]) {
                            mergedReference[k] = references.items[i][k];
                        } else if (undefined !== refValues[k]) {
                            mergedReference[k] = refValues[k];
                        }
                    }

                    mergedReferences.items.push(mergedReference);
                }
            }

            return mergedReferences;
        }
    }

    return mergeBranchReferences(references, branchesReferences);
}

/**
 * Merge the references of a branch for a reference.
 *
 * @param {Mixed} reference The reference.
 * @param {Array} branch A branch of references.
 * @param {Boolean} simple Is this a simple reference?
 * @return {Array} The merged references.
 * @api private
 */
var resolveBranchBranchesReferences = function(reference, branch, simple) {
    var references;

    if (simple) {
        references = resolveBranchReferences(branch, reference, simple);
    } else {
        references = resolveBranchReferences(branch, reference);
    }

    return references;
}

/**
 * Merge the references of two branches.
 *
 * @param {Object} references1 The first block of references.
 * @param {Object} references2 The second block of references.
 * @return {Object} The merged references.
 * @api private
 */
var mergeBranchReferences = function(references1, references2) {
    var references = { items: [], isArray: (references1.isArray || references2.isArray) };

    if (0 === references1.items.length) {
        for (var i = 0; i < references2.items.length; i++) {
            var refValues = references2.items[i];

            if (refValues && refValues.items) {
                for (var j = 0; j < refValues.items.length; j++) {
                    references.items.push(refValues.items[j]);
                }
            } else {
                references.items.push(refValues);
            }
        }
    } else if (0 === references2.items.length) {
        for (var i = 0; i < references1.items.length; i++) {
            var refValues = references1.items[i];

            if (refValues && refValues.items) {
                for (var j = 0; j < refValues.items.length; j++) {
                    references.items.push(refValues.items[j]);
                }
            } else {
                references.items.push(refValues);
            }
        }
    } else {
        for (var i = 0; i < references1.items.length; i++) {
            var refValues1 = references1.items[i];

            for (var j = 0; j < references2.items.length; j++) {
                var refValues2 = references2.items[j];

                if (refValues1.items && refValues2.items) {
                    for (var l = 0; l < refValues1.items.length; l++) {
                        for (var m = 0; m < refValues2.items.length; m++) {
                            var referenceLength = Math.max(refValues1.items[l].length, refValues2.items[m].length)
                                mergedReference = []
                            ;

                            for (var k = 0; k < referenceLength; k++) {
                                if (undefined !== refValues1.items[l][k]) {
                                    mergedReference[k] = refValues1.items[l][k];
                                } else if (undefined !== refValues2.items[m][k]) {
                                    mergedReference[k] = refValues2.items[m][k];
                                }
                            }

                            references.items.push(mergedReference);
                        }
                    }
                } else if (refValues1.items) {
                    for (var l = 0; l < refValues1.items.length; l++) {
                        var referenceLength = Math.max(refValues1.items[l].length, refValues2.length)
                            mergedReference = []
                        ;

                        for (var k = 0; k < referenceLength; k++) {
                            if (undefined !== refValues1.items[l][k]) {
                                mergedReference[k] = refValues1.items[l][k];
                            } else if (undefined !== refValues2[k]) {
                                mergedReference[k] = refValues2[k];
                            }
                        }

                        references.items.push(mergedReference);
                    }
                } else if (refValues2.items) {
                    for (var l = 0; l < refValues2.items.length; l++) {
                        var referenceLength = Math.max(refValues2.items[l].length, refValues1.length)
                            mergedReference = []
                        ;

                        for (var k = 0; k < referenceLength; k++) {
                            if (undefined !== refValues2.items[l][k]) {
                                mergedReference[k] = refValues2.items[l][k];
                            } else if (undefined !== refValues1[k]) {
                                mergedReference[k] = refValues1[k];
                            }
                        }

                        references.items.push(mergedReference);
                    }
                } else {
                    var referenceLength = Math.max(refValues1.length, refValues2.length),
                        mergedReference = []
                    ;

                    for (var k = 0; k < referenceLength; k++) {
                        if (undefined !== refValues1[k]) {
                            mergedReference[k] = refValues1[k];
                        } else if (undefined !== refValues2[k]) {
                            mergedReference[k] = refValues2[k];
                        }
                    }

                    references.items.push(mergedReference);
                }
            }
        }
    }

    return references;
}