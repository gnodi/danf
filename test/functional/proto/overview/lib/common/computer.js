'use strict';

module.exports = Computer;

function Computer() {
}

// Define a dependency that the dependency injection should set.
// The private property '_processors' should be an array of objects, instances of
// the interface 'processor'.
Computer.defineDependency('_processors', 'processor_array');

// Define a property.
Object.defineProperty(Computer.prototype, 'processors', {
    get: function() { return this._processors; },
    set: function(processors) {
        this._processors = [];

        for (var i in processors) {
            var processor = processors[i];

            this._processors[processor.order] = processor;
        }
    }
});

// Define a method.
Computer.prototype.compute = function(value, timeout) {
    var self = this;

    // Handle asynchronous computation.
    if (timeout) {
        // Wrap an asynchronous operation in order to return the result to the stream.
        this.__asyncProcess(function(returnAsync) {
            // Simulate an asynchronous computation.
            setTimeout(
                function() {
                    for (var i = 0; i < self._processors.length; i++) {
                        value = self._processors[i].process(value);
                    }

                    // Return the computed value to the stream.
                    returnAsync(value);
                },
                timeout
            );
        });
    // Handle synchronous computation.
    } else {
        for (var i = 0; i < this._processors.length; i++) {
            value = this._processors[i].process(value);
        }

        // Return the computed value to the stream.
        return value;
    }
}