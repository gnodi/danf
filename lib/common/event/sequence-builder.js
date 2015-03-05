'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('-/danf/utils') : require('../../utils');

    /**
     * Initialize a new events handler.
     *
     * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
     * @param {danf:dependencyInjection.servicesContainer} servicesContainer The services container.
     * @param {danf:dependencyInjection.provider<danf:manipulation.sequencer>} newSequencerProvider The provider of new sequencer.
     * @param {danf:dependencyInjection.contextProvider<danf:manipulation.sequencer>} currentSequencerProvider The provider of current sequencer.
     */
    function SequenceBuilder(referenceResolver, servicesContainer, newSequencerProvider, currentSequencerProvider) {
        this._sequences = {};
        this._config = {};
        if (referenceResolver) {
            this.referenceResolver = referenceResolver;
        }
        if (servicesContainer) {
            this.servicesContainer = servicesContainer;
        }
        if (newSequencerProvider) {
            this.newSequencerProvider = newSequencerProvider;
        }
        if (currentSequencerProvider) {
            this.currentSequencerProvider = currentSequencerProvider;
        }
    }

    SequenceBuilder.defineImplementedInterfaces(['danf:event.sequenceBuilder', 'danf:manipulation.registryObserver']);

    SequenceBuilder.defineDependency('_config', 'object');
    SequenceBuilder.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');
    SequenceBuilder.defineDependency('_servicesContainer', 'danf:dependencyInjection.servicesContainer');
    SequenceBuilder.defineDependency('_newSequencerProvider', 'danf:dependencyInjection.provider', 'danf:manipulation.sequencer');
    SequenceBuilder.defineDependency('_currentSequencerProvider', 'danf:dependencyInjection.contextProvider', 'danf:manipulation.sequencer');

    /**
     * Set the reference resolver.
     *
     * @param {danf:manipulation.referenceResolver}
     * @api public
     */
    Object.defineProperty(SequenceBuilder.prototype, 'referenceResolver', {
        set: function(referenceResolver) { this._referenceResolver = referenceResolver; }
    });

    /**
     * Set the services container.
     *
     * @param {danf:dependencyInjection.servicesContainer}
     * @api public
     */
    Object.defineProperty(SequenceBuilder.prototype, 'servicesContainer', {
        set: function(servicesContainer) { this._servicesContainer = servicesContainer; }
    });

    /**
     * Set the provider of new sequencer.
     *
     * @param {danf:dependencyInjection.provider<danf:manipulation.sequencer>} newSequencerProvider The provider of new sequencer.
     * @api public
     */
    Object.defineProperty(SequenceBuilder.prototype, 'newSequencerProvider', {
        set: function(newSequencerProvider) { this._newSequencerProvider = newSequencerProvider; }
    });

    /**
     * Set the provider of current sequencer.
     *
     * @param {danf:dependencyInjection.contextProvider<danf:manipulation.sequencer>} currentSequencerProvider The provider of current sequencer.
     * @api public
     */
    Object.defineProperty(SequenceBuilder.prototype, 'currentSequencerProvider', {
        set: function(currentSequencerProvider) { this._currentSequencerProvider = currentSequencerProvider; }
    });

    /**
     * Set the config.
     *
     * @param {object}
     * @api public
     */
    Object.defineProperty(SequenceBuilder.prototype, 'config', {
        set: function(config) { this._config = config; }
    });

    /**
     * @interface {danf:manipulation.registryObserver}
     */
    SequenceBuilder.prototype.handleRegistryChange = function(items, reset, name) {
        if (!reset) {
            for (var sequenceName in items) {
                this.build(sequenceName, items[sequenceName]);
            }
        }
    }

    /**
     * @interface {danf:event.sequenceBuilder}
     */
    SequenceBuilder.prototype.get = function(name) {
        if (this._sequences[name]) {
            return this._sequences[name];
        }

        throw new Error('The sequence "{0}" is not defined.'.format(name));
    }

    /**
     * @interface {danf:event.sequenceBuilder}
     */
    SequenceBuilder.prototype.build = function(name, sequence) {
        var self = this,
            sequencer = this._sequences[name] = this._newSequencerProvider.provide()
        ;

        for (var j = 0; j < sequence.length; j++) {
            (function(operation) {
                var service = self._servicesContainer.get(operation.service);

                if (null == service) {
                    throw new Error(
                        'The service "{0}" is not defined.'.format(
                            operation.service
                        )
                    );
                }

                if ('function' !== typeof service[operation.method]) {
                    throw new Error(
                        'The service "{0}" has no method "{1}".'.format(
                            operation.service,
                            operation.method
                        )
                    );
                }

                sequencer.addGlobalContext(function(reset) {
                    if (reset) {
                        self._currentSequencerProvider.unset();
                    } else {
                        // Set the current sequencer.
                        self._currentSequencerProvider.set(sequencer);
                    }
                });

                sequencer.pipe(
                    function(stream) {
                        if (null == stream) {
                            stream = {};
                        }

                        Object.checkType(stream, 'object');

                        // Check optional condition.
                        if (operation.condition) {
                            if (!operation.condition(stream)) {
                                return function(stream) {
                                    return stream;
                                };
                            }
                        }

                        // Resolve arguments with the stream in the pipe.
                        var resolvedArguments = [];

                        for (var i = 0; i < operation.arguments.length; i++) {
                            var argument = operation.arguments[i];

                            if ('string' === typeof argument) {
                                argument = self._referenceResolver.resolve(argument, '@', stream);

                                if ('string' === typeof argument) {
                                    argument = self._referenceResolver.resolve(argument, '$', self._config);
                                }
                            }

                            resolvedArguments[i] = argument;
                        }

                        // Call the target handler.
                        var result = service[operation.method].apply(service, resolvedArguments);

                        if ('function' === typeof result && result.asynchrone) {
                            return result;
                        }

                        return function(stream) {
                            return undefined !== result ? result : stream;
                        };
                    },
                    operation.returns
                );
            })(sequence[j]);
        }

        return sequencer;
    }

    /**
     * @interface {danf:event.sequenceBuilder}
     */
    SequenceBuilder.prototype.compose = function(sequences) {
        var sequencer = this._newSequencerProvider.provide();

        for (var i = 0; i < sequences.length; i++) {
            var sequence = this.get(sequences[i]);

            sequencer.pipe(sequence);
        }

        return sequencer;
    }

    /**
     * Expose `SequenceBuilder`.
     */
    return SequenceBuilder;
});