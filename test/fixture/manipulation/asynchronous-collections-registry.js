'use strict';

require('../../../lib/common/init');

var AsynchronousCollection = require('../../../lib/common/manipulation/asynchronous-collection'),
    ErrorResultAsynchronousCallback = require('../../../lib/common/manipulation/asynchronous-callback/error-result'),
    ErrorAsynchronousCallback = require('../../../lib/common/manipulation/asynchronous-callback/error'),
    ResultAsynchronousCallback = require('../../../lib/common/manipulation/asynchronous-callback/result'),
    CollectionAsynchronousIterator = require('../../../lib/common/manipulation/asynchronous-iterator/collection'),
    KeyAsynchronousIterator = require('../../../lib/common/manipulation/asynchronous-iterator/key'),
    MemoAsynchronousIterator = require('../../../lib/common/manipulation/asynchronous-iterator/memo'),
    ArrayAsynchronousInput = require('../../../lib/common/manipulation/asynchronous-input/array'),
    ObjectAsynchronousInput = require('../../../lib/common/manipulation/asynchronous-input/object'),
    Registry = require('../../../lib/common/manipulation/registry')
;

var asynchronousCollection = new AsynchronousCollection(),
    errorResultAsynchronousCallback = new ErrorResultAsynchronousCallback(),
    errorAsynchronousCallback = new ErrorAsynchronousCallback(),
    resultAsynchronousCallback = new ResultAsynchronousCallback(),
    collectionAsynchronousIterator = new CollectionAsynchronousIterator(),
    keyAsynchronousIterator = new KeyAsynchronousIterator(),
    memoAsynchronousIterator = new MemoAsynchronousIterator(),
    arrayAsynchronousInput = new ArrayAsynchronousInput(),
    objectAsynchronousInput = new ObjectAsynchronousInput(),
    registry = new Registry()
;

var collections = {
        each: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        eachSeries: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        eachLimit: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorAsynchronousCallback,
            parameters: {
                limit: 1
            }
        },
        forEachOf: {
            input: objectAsynchronousInput,
            iterator: keyAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        forEachOfSeries: {
            input: objectAsynchronousInput,
            iterator: keyAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        forEachOfLimit: {
            input: objectAsynchronousInput,
            iterator: keyAsynchronousIterator,
            callback: errorAsynchronousCallback,
            parameters: {
                limit: 1
            }
        },
        map: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        },
        mapSeries: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        },
        mapLimit: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback,
            parameters: {
                limit: 1
            }
        },
        filter: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        filterSeries: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        reject: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        rejectSeries: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        reduce: {
            input: arrayAsynchronousInput,
            iterator: memoAsynchronousIterator,
            callback: errorResultAsynchronousCallback,
            parameters: {
                memo: 1
            }
        },
        reduceRight: {
            input: arrayAsynchronousInput,
            iterator: memoAsynchronousIterator,
            callback: errorResultAsynchronousCallback,
            parameters: {
                memo: 1
            }
        },
        detect: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        detectSeries: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        sortBy: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        },
        some: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        every: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        concat: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        },
        concatSeries: {
            input: arrayAsynchronousInput,
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        }
    }
;

for (var method in collections) {
    var collection = collections[method],
        asynchronousCollection = new AsynchronousCollection()
    ;

    asynchronousCollection.input = collection.input;
    asynchronousCollection.iterator = collection.iterator;
    asynchronousCollection.callback = collection.callback;
    asynchronousCollection.parameters = collection.parameters;

    registry.register(method, asynchronousCollection);
}

module.exports = registry;