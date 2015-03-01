'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new classes handler.
     *
     * @param {danf:object.classesRegistry} classesRegistry The classes registry.
     */
    function ClassesHandler(classesRegistry) {
        if (classesRegistry) {
            this.classesRegistry = classesRegistry;
        }
        this._classProcessors = [];
        this._processedClasses = {};
    }

    ClassesHandler.defineImplementedInterfaces(['danf:object.classesHandler']);

    ClassesHandler.defineDependency('_classProcessors', 'danf:object.classProcessor_array');
    ClassesHandler.defineDependency('_classesRegistry', 'danf:object.classesRegistry');

    /**
     * Set the classes registry.
     *
     * @param {danf:object.classesRegistry} classesRegistry The classes registry.
     * @api public
     */
    Object.defineProperty(ClassesHandler.prototype, 'classesRegistry', {
        set: function(classesRegistry) {
            this._classesRegistry = classesRegistry;
        }
    });

    /**
     * Set the processors of a class.
     *
     * @param {danf:object.classProcessor_array} classProcessors The processors of a class.
     * @api public
     */
    Object.defineProperty(ClassesHandler.prototype, 'classProcessors', {
        set: function(classProcessors) {
            for (var i = 0; i < classProcessors.length; i++) {
                this.addClassProcessor(classProcessors[i]);
            }
        }
    });

    /**
     * Add a processor of a class.
     *
     * @param {danf:object.classProcessor} newClassProcessor The processor of a class.
     * @api public
     */
    ClassesHandler.prototype.addClassProcessor = function(newClassProcessor) {
        var added = false;

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
     * @interface {danf:object.classesHandler}
     */
    ClassesHandler.prototype.process = function () {
        var classes = this._classesRegistry.getAll();

        for (var name in classes) {
            if (!this._processedClasses[name]) {
                var class_ = classes[name];

                for (var i = 0; i < this._classProcessors.length; i++) {
                    this._classProcessors[i].process(class_);
                }

                this._processedClasses[name] = true;
            }
        }
    }

    /**
     * Expose `ClassesHandler`.
     */
    return ClassesHandler;
});