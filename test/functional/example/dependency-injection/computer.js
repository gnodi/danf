'use strict';

/**
 * Expose `Computer`.
 */
module.exports = Computer;

/**
 * Initialize a new adder processor.
 */
function Computer() {
    this._processors = {};
    this._parser;
}

Computer.defineImplementedInterfaces(['computer']);

// Define dependencies in order to check their correct injection, ensure interfaces, ...
Computer.defineDependency('_parser', 'parser');
Computer.defineDependency('_processors', 'processor_object');

/**
 * @interface {processor}
 */
Computer.prototype.compute = function(operation) {
    var parsedOperation = this._parser.parse(operation),
        result = parseInt(parsedOperation.shift(), 10)
    ;

    for (var i = 0; i < parsedOperation.length; i = i + 2) {
        result = getProcessor.call(this, parsedOperation[i])
            .process(result, parseInt(parsedOperation[i + 1]))
        ;
    }

    return result;
}

Object.defineProperty(Computer.prototype, 'parser', {
    set: function(parser) { this._parser = parser; }
});

Object.defineProperty(Computer.prototype, 'processors', {
    set: function(processors) {
        for (var i = 0; i < processors.length; i++) {
            var processor = processors[i];

            this._processors[processor.operation] = processor;
        }
    }
});

/**
 * @interface {processor}
 */
Computer.prototype.parse = function(operation) {
    return operation.slit(' ');
}

var getProcessor = function(operation) {
    if (undefined === this._processors[operation]) {
        throw new Error('No operation "{0}" found.'.format(operation));
    }

    return this._processors[operation];
}