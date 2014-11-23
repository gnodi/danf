'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new classes handler.
     *
     * @param {danf:object.classesIndexer} classesIndexer The classes indexer.
     */
    function ClassesHandler(classesIndexer) {
        if (classesIndexer) {
            this.classesIndexer = classesIndexer;
        }
        this._classProcessors = [];
        this._processedClasses = {};
    }

    ClassesHandler.defineImplementedInterfaces(['danf:object.classesHandler']);

    ClassesHandler.defineDependency('_classProcessors', 'danf:object.classProcessor_array');
    ClassesHandler.defineDependency('_classesIndexer', 'danf:object.classesIndexer');

    /**
     * Set the classes indexer.
     *
     * @param {danf:object.classesIndexer} classesIndexer The classes indexer.
     * @api public
     */
    Object.defineProperty(ClassesHandler.prototype, 'classesIndexer', {
        set: function(classesIndexer) {
            this._classesIndexer = classesIndexer;
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

        newClassProcessor.classesHandler = this;
    }

    /**
     * @interface {danf:object.classesHandler}
     */
    ClassesHandler.prototype.process = function () {
        var classes = this._classesIndexer.getAll();

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