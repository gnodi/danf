'use strict';

module.exports = {
    frameworkSelector: require('../../lib/server/framework-selector'),
    questionsRetriever: require('../../lib/server/questions-retriever'),
    categoryComputer: {
        abstract: require('../../lib/server/category-computer/abstract'),
        dumb: require('../../lib/server/category-computer/dumb'),
        useless: require('../../lib/server/category-computer/useless')
    },
    benchmarker: require('../../lib/common/benchmarker')
};