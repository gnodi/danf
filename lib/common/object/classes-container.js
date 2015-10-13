'use strict';

/**
 * Expose `ClassesContainer`.
 */
module.exports = ClassesContainer;

/**
 * Initialize a new classes container.
 */
function ClassesContainer() {
    this._definitions = {};
    this._classes = {};
    this._classProcessors = [];
}

ClassesContainer.defineImplementedInterfaces(['danf:object.classesContainer', 'danf:manipulation.registryObserver']);

ClassesContainer.defineDependency('_classProcessors', 'danf:object.classProcessor_array');

/**
 * Set the class processors.
 *
 * @param {danf:object.classProcessor_array} classProcessors The class processors.
 * @api public
 */
Object.defineProperty(ClassesContainer.prototype, 'classProcessors', {
    set: function(classProcessors) {
        this._classProcessors = [];

        for (var i = 0; i < classProcessors.length; i++) {
            this.addClassProcessor(classProcessors[i]);
        }
    }
});

/**
 * Add a class processor.
 *
 * @param {danf:object.classProcessor} newClassProcessor The class processor.
 * @api public
 */
ClassesContainer.prototype.addClassProcessor = function(newClassProcessor) {
    var added = false;

    newClassProcessor.classesContainer = this;

    for (var i = 0; i < this._classProcessors.length; i++) {
        var classProcessor = this._classProcessors[i];

        if (newClassProcessor.order < classProcessor.order) {
            this._classProcessors.splice(i, 0, newClassProcessor);
            added = true;

            break;
        }
    }

    if (!added) {
        this._classProcessors.push(newClassProcessor);
    }
}

/**
 * @interface {danf:manipulation.registryObserver}
 */
ClassesContainer.prototype.handleRegistryChange = function(items, reset, name) {
    if (!reset) {
        for (var id in items) {
           this.setDefinition(id, items[id]);
        }
    } else {
        for (var id in items) {
           delete this._definitions[id];
           delete this._classes[id];
        }
    }

    this.build();
}

/**
 * @interface {danf:object.classesContainer}
 */
ClassesContainer.prototype.setDefinition = function(id, class_) {
    class_.__metadata.id = id;

    this._definitions[id] = class_;
}

/**
 * @interface {danf:object.classesContainer}
 */
ClassesContainer.prototype.getDefinition = function(id) {
    if (!this.hasDefinition(id)) {
        throw new Error(
            'The class "{0}" is not defined.'.format(id)
        );
    }

    return this._definitions[id];
}

/**
 * @interface {danf:object.classesContainer}
 */
ClassesContainer.prototype.hasDefinition = function(id) {
    return this._definitions[id] ? true : false;
}

/**
 * @interface {danf:object.classesContainer}
 */
ClassesContainer.prototype.build = function() {
    // Build.
    for (var id in this._definitions) {
        if (!this.has(id)) {
            this._classes[id] = this.get(id);
        }
    }
}

/**
 * @interface {danf:object.classesContainer}
 */
ClassesContainer.prototype.get = function(id) {
    if (!this.has(id)) {
        var class_ = this.getDefinition(id);

        for (var i = 0; i < this._classProcessors.length; i++) {
            this._classProcessors[i].process(class_);
        }

        this._classes[id] = class_;
    }

    return this._classes[id];
}

/**
 * @interface {danf:object.classesContainer}
 */
ClassesContainer.prototype.has = function(id) {
    return this._classes[id] ? true : false;
}