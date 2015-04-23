'use strict';

module.exports = Benchmarker;

function Benchmarker() {
    this._measures = {};
}

Benchmarker.defineImplementedInterfaces(['benchmarker']);

/**
 * @interface {benchmarker}
 */
Benchmarker.prototype.start = function(measure) {
    var now = new Date();

    this._measures[measure] = now.getTime();
}

/**
 * @interface {benchmarker}
 */
Benchmarker.prototype.end = function(measure) {
    if (!this._measures[measure]) {
        throw new Error('No measure for "{0}" started.'.format(measure));
    }

    var now = new Date();

    console.log('{0}: {1}ms'.format(
        measure,
        now.getTime() - this._measures[measure]
    ));

    delete this._measures[measure];
}