'use strict';

define(function(require) {
    /**
     * Initialize a new Processor.
     */
    function Processor() {
        this._ajaxProcessors = [];
    }

    Processor.defineImplementedInterfaces(['danf:ajaxApp.processor']);

    Processor.defineDependency('_ajaxProcessors', 'danf:ajaxApp.processor_array');

    /**
     * Set the ajax processors.
     *
     * @param {danf:ajaxApp.processor_array}
     * @api public
     */
    Object.defineProperty(Processor.prototype, 'ajaxProcessors', {
        set: function(ajaxProcessors) { this._ajaxProcessors = ajaxProcessors; }
    });

    /**
     * @interface {danf:ajaxApp.processor}
     */
    Processor.prototype.process = function(event, data) {
        for (var i = 0; i < this._ajaxProcessors.length; i++) {
            this._ajaxProcessors[i].process(event, data);
        }
    }

    /**
     * Expose `Processor`.
     */
    return Processor;
});