'use strict';

/**
 * Expose `DataResolver`.
 */
module.exports = DataResolver;

/**
 * Initialize a new data resolver.
 */
function DataResolver() {
    this._dataInterpreters = [];
}

DataResolver.defineImplementedInterfaces(['danf:manipulation.dataResolver']);

DataResolver.defineDependency('_dataInterpreters', 'danf:manipulation.dataInterpreter_array');

/**
 * Data interpreters.
 *
 * @var {danf:manipulation.dataInterpreter_array}
 * @api public
 */
Object.defineProperty(DataResolver.prototype, 'dataInterpreters', {
    set: function(dataInterpreters) {
        this._dataInterpreters = [];

        for (var i = 0; i < dataInterpreters.length; i++) {
            this.addDataInterpreter(dataInterpreters[i]);
        }
    }
});

/**
 * Add a data interpreter.
 *
 * @param {danf:manipulation.dataInterpreter} newDataInterpreter The data interpreter.
 * @api public
 */
DataResolver.prototype.addDataInterpreter = function(newDataInterpreter) {
    var added = false,
        order = newDataInterpreter.order
    ;

    newDataInterpreter.dataResolver = this;

    // Register service definers.
    for (var i = 0; i < this._dataInterpreters.length; i++) {
        var dataInterpreter = this._dataInterpreters[i];

        if (order < dataInterpreter.order) {
            this._dataInterpreters.splice(i, 0, newDataInterpreter);
            added = true;

            break;
        }
    }

    if (!added) {
        this._dataInterpreters.push(newDataInterpreter);
    }
}

/**
 * @interface {danf:manipulation.dataResolver}
 */
DataResolver.prototype.merge = function(data1, data2, contract, erase, namespace, parameters, isRoot) {
    return mergeData.call(
        this,
        namespace ? namespace : '',
        data1,
        data2,
        isRoot === false ? contract : formatContract.call(this, contract),
        erase,
        parameters || {}
    );
}

/**
 * @interface {danf:manipulation.dataResolver}
 */
DataResolver.prototype.resolve = function(data, contract, namespace, parameters, isRoot) {
    return processField.call(
        this,
        namespace ? namespace : '',
        data,
        isRoot === false ? contract : formatContract.call(this, contract),
        parameters || {}
    );
}

/**
 * Format a contract.
 *
 * @param {object} contract The contract.
 * @return {object} The formatted contract.
 * @api private
 */
var formatContract = function(contract) {
    for (var i = 0; i < this._dataInterpreters.length; i++) {
        contract = this._dataInterpreters[i].formatContract(contract);
    }

    return contract;
}

/**
 * Merge two data.
 *
 * @param {string} name The name of the field.
 * @param {object} data1 The first data.
 * @param {object} data2 The second data.
 * @param {object} contract The contract to merge the data.
 * @param {object} erase Should erase data1 with data2 if conflicts?
 * @param {object|null} parameters The additional parameters used for the resolving.
 * @return {object} The merged data.
 * @api private
 */
var mergeData = function(name, data1, data2, contract, erase, parameters) {
    var mergedData = mergeField.call(
        this,
        name,
        data1,
        data2,
        contract,
        erase,
        parameters
    );

    for (var field in data2) {
        if (undefined === mergedData[field]) {
            mergedData[field] = data2[field];
        }
    }

    return mergedData;
}

/**
 * Merge a field.
 *
 * @param {string} name The name of the field.
 * @param {object} value1 The first value.
 * @param {object} value2 The second value.
 * @param {object} contract The contract to merge the field.
 * @param {object} erase Should erase value1 with value2 if conflicts?
 * @param {object|null} parameters The additional parameters used for the resolving.
 * @return {object} The merged field.
 * @throws {error} If there is some conflicts and erase is false.
 * @api private
 */
var mergeField = function(name, value1, value2, contract, erase, parameters) {
    var value;

    for (var i = 0; i < this._dataInterpreters.length; i++) {
        value = this._dataInterpreters[i].merge(
            name,
            value,
            value1,
            value2,
            contract,
            erase,
            parameters
        );
    }

    return value;
}

/**
 * Process a field.
 *
 * @param {string} name The name of the field.
 * @param {object} value The value of the field.
 * @param {object} contract The contract to validate the field.
 * @param {object|null} parameters The additional parameters used for the resolving.
 * @return {object} The processed field value.
 * @api private
 */
var processField = function(name, value, contract, parameters) {
    // Check the contract existence for the field.
    if (!contract) {
        throw new Error(
            'There is no defined contract for the field "{0}".'.format(
                name
            )
        );
    } else if ('object' !== typeof contract) {
        throw new Error(
            'The contract of the field "{0}" must be an object.'.format(
                name
            )
        );
    }

    for (var i = 0; i < this._dataInterpreters.length; i++) {
        value = this._dataInterpreters[i].interpret(name, value, contract, parameters);
    }

    return value;
}