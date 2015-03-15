'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = require('../utils'),
        ObjectProvider = require('../dependency-injection/object-provider')
    ;

    /**
     * Initialize a new sequencer provider.
     *
     * @param {string} class_ The class of the provided object.
     * @param {danf:object.interfacer} interfacer The interfacer.
     * @param {string} interface_ The interface the context should implement (optional).
     * @api public
     */
    function SequencerProvider(class_, interfacer, sequencerStack) {
        ObjectProvider.call(this, class_, interfacer, 'danf:manipulation.sequencer');

        if (sequencerStack) {
            this.sequencerStack = sequencerStack;
        }
    }

    utils.extend(ObjectProvider, SequencerProvider);

    SequencerProvider.defineDependency('_sequencerStack', 'danf:manipulation.sequencerStack');

    /**
     * Set the sequencer stack.
     *
     * @param {danf:manipulation.sequencerStack} The sequencer stack.
     * @api public
     */
    Object.defineProperty(SequencerProvider.prototype, 'sequencerStack', {
        set: function(sequencerStack) { this._sequencerStack = sequencerStack; }
    });

    /**
     * @interface {danf:dependencyInjection.provider}
     */
    SequencerProvider.prototype.provide = function() {
        var sequencer = ObjectProvider.prototype.provide.call(this);

        sequencer.sequencerStack = this._sequencerStack;

        return sequencer;
    }

    /**
     * Expose `SequencerProvider`.
     */
    return SequencerProvider;
});