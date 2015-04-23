'use strict';

/**
 * Expose `ReferenceType`.
 */
module.exports = ReferenceType;

/**
 * Initialize a new reference type.
 */
function ReferenceType() {
    this._size = 1;
    this._namespaces = [0];
    this._allowsConcatenation = true;
}

ReferenceType.defineImplementedInterfaces(['danf:manipulation.referenceType']);

ReferenceType.defineDependency('_name', 'string');
ReferenceType.defineDependency('_delimiter', 'string');
ReferenceType.defineDependency('_size', 'number');
ReferenceType.defineDependency('_namespaces', 'number_array');
ReferenceType.defineDependency('_allowsConcatenation', 'boolean');

/**
 * @interface {danf:manipulation.referenceType}
 */
Object.defineProperty(ReferenceType.prototype, 'name', {
    get: function() { return this._name; },
    set: function(name) { this._name = name; }
});

/**
 * @interface {danf:manipulation.referenceType}
 */
Object.defineProperty(ReferenceType.prototype, 'delimiter', {
    get: function() { return this._delimiter; },
    set: function(delimiter) { this._delimiter = delimiter; }
});

/**
 * @interface {danf:manipulation.referenceType}
 */
Object.defineProperty(ReferenceType.prototype, 'size', {
    get: function() { return this._size; },
    set: function(size) { this._size = size; }
});

/**
 * @interface {danf:manipulation.referenceType}
 */
Object.defineProperty(ReferenceType.prototype, 'namespaces', {
    get: function() { return this._namespaces; },
    set: function(namespaces) { this._namespaces = namespaces; }
});

/**
 * @interface {danf:manipulation.referenceType}
 */
Object.defineProperty(ReferenceType.prototype, 'allowsConcatenation', {
    get: function() { return this._allowsConcatenation; },
    set: function(allowsConcatenation) { this._allowsConcatenation = allowsConcatenation; }
});