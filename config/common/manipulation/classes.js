'use strict';

module.exports = {
    escaper: require('../../../lib/common/manipulation/escaper'),
    referenceResolver: require('../../../lib/common/manipulation/reference-resolver'),
    referenceType: require('../../../lib/common/manipulation/reference-type'),
    dataResolver: require('../../../lib/common/manipulation/data-resolver'),
    map: require('../../../lib/common/manipulation/map'),
    registry: require('../../../lib/common/manipulation/registry'),
    notifierRegistry: require('../../../lib/common/manipulation/notifier-registry'),
    callbackExecutor: require('../../../lib/common/manipulation/callback-executor'),
    flow: require('../../../lib/common/manipulation/flow'),
    flowDriver: require('../../../lib/common/manipulation/flow-driver'),
    dataInterpreter: {
        abstract: require('../../../lib/common/manipulation/data-interpreter/abstract'),
        flatten: require('../../../lib/common/manipulation/data-interpreter/flatten'),
        default: require('../../../lib/common/manipulation/data-interpreter/default'),
        required: require('../../../lib/common/manipulation/data-interpreter/required'),
        type: require('../../../lib/common/manipulation/data-interpreter/type')
    },
    asynchronousCallback: {
        error: require('../../../lib/common/manipulation/asynchronous-callback/error'),
        errorResult: require('../../../lib/common/manipulation/asynchronous-callback/error-result'),
        result: require('../../../lib/common/manipulation/asynchronous-callback/result')
    },
    asynchronousInput: {
        array: require('../../../lib/common/manipulation/asynchronous-input/array'),
        object: require('../../../lib/common/manipulation/asynchronous-input/object')
    },
    asynchronousIterator: {
        collection: require('../../../lib/common/manipulation/asynchronous-iterator/collection'),
        key: require('../../../lib/common/manipulation/asynchronous-iterator/key'),
        memo: require('../../../lib/common/manipulation/asynchronous-iterator/memo')
    },
    asynchronousCollection: require('../../../lib/common/manipulation/asynchronous-collection')
};