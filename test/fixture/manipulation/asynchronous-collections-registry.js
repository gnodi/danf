'use strict';

require('../../../lib/common/init');

var AsynchronousCollection = require('../../../lib/common/manipulation/asynchronous-collection'),
    ErrorResultAsynchronousCallback = require('../../../lib/common/manipulation/asynchronous-callback/error-result'),
    ErrorAsynchronousCallback = require('../../../lib/common/manipulation/asynchronous-callback/error'),
    ResultAsynchronousCallback = require('../../../lib/common/manipulation/asynchronous-callback/result'),
    CollectionAsynchronousIterator = require('../../../lib/common/manipulation/asynchronous-iterator/collection'),
    KeyAsynchronousIterator = require('../../../lib/common/manipulation/asynchronous-iterator/key'),
    MemoAsynchronousIterator = require('../../../lib/common/manipulation/asynchronous-iterator/memo'),
    Registry = require('../../../lib/common/manipulation/registry')
;

var asynchronousCollection = new AsynchronousCollection(),
    errorResultAsynchronousCallback = new ErrorResultAsynchronousCallback(),
    errorAsynchronousCallback = new ErrorAsynchronousCallback(),
    resultAsynchronousCallback = new ResultAsynchronousCallback(),
    collectionAsynchronousIterator = new CollectionAsynchronousIterator(),
    keyAsynchronousIterator = new KeyAsynchronousIterator(),
    memoAsynchronousIterator = new MemoAsynchronousIterator(),
    registry = new Registry()
;

var collections = {
        each: {
            iterator: collectionAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        eachSeries: {
            iterator: collectionAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        eachLimit: {
            iterator: collectionAsynchronousIterator,
            callback: errorAsynchronousCallback,
            parameters: {
                limit: 1
            }
        },
        forEachOf: {
            iterator: keyAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        forEachOfSeries: {
            iterator: keyAsynchronousIterator,
            callback: errorAsynchronousCallback
        },
        forEachOfLimit: {
            iterator: keyAsynchronousIterator,
            callback: errorAsynchronousCallback,
            parameters: {
                limit: 1
            }
        },
        map: {
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        },
        mapSeries: {
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        },
        filter: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        filterSeries: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        reject: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        rejectSeries: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        reduce: {
            iterator: memoAsynchronousIterator,
            callback: errorResultAsynchronousCallback,
            parameters: {
                memo: 1
            }
        },
        reduceRight: {
            iterator: memoAsynchronousIterator,
            callback: errorResultAsynchronousCallback,
            parameters: {
                memo: 1
            }
        },
        detect: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        detectSeries: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        sortBy: {
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback
        },
        some: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        every: {
            iterator: collectionAsynchronousIterator,
            callback: resultAsynchronousCallback
        },
        concat: {
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback,
            parameters: {
                memo: 1
            }
        },
        concatRight: {
            iterator: collectionAsynchronousIterator,
            callback: errorResultAsynchronousCallback,
            parameters: {
                memo: 1
            }
        }
    }
;

for (var method in collections) {
    var collection = collections[method],
        asynchronousCollection = new AsynchronousCollection()
    ;

    asynchronousCollection.iterator = collection.iterator;
    asynchronousCollection.callback = collection.callback;
    asynchronousCollection.parameters = collection.parameters;

    registry.register(method, asynchronousCollection);
}

module.exports = registry;