'use strict';

define(function(require) {
    function ListDisplayer() {
    }

    ListDisplayer.defineImplementedInterfaces(['displayer']);

    ListDisplayer.defineDependency('_measure', 'string');
    ListDisplayer.defineDependency('_jquery', 'function');
    ListDisplayer.defineDependency('_benchmarker', 'benchmarker');

    /**
     * Set the id of the computing measure.
     *
     * @param {measure}
     * @api public
     */
    Object.defineProperty(ListDisplayer.prototype, 'measure', {
        set: function(measure) { this._measure = measure; }
    });

    /**
     * Set JQuery.
     *
     * @param {function}
     * @api public
     */
    Object.defineProperty(ListDisplayer.prototype, 'jquery', {
        set: function(jquery) { this._jquery = jquery; }
    });

    /**
     * Set the benchmarker.
     *
     * @param {benchmarker}
     * @api public
     */
    Object.defineProperty(ListDisplayer.prototype, 'benchmarker', {
        set: function(benchmarker) { this._benchmarker = benchmarker; }
    });

    /**
     * @interface {ListDisplayer}
     */
    ListDisplayer.prototype.display = function(id, object) {
        var $ = this._jquery,
            list = $(document.createElement('ul'))
        ;

        for (var key in object) {
            var item = $(document.createElement('li'));

            item.text('{0}: {1}'.format(key, object[key]));
            list.append(item);
        }

        $('#{0}'.format(id)).html(list);
        $('#{0}-title'.format(id)).show();

        this._benchmarker.end(this._measure);
    }

    return ListDisplayer;
});