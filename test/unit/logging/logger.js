'use strict';

require('../../../lib/common/init');

var Logger = require('../../../lib/common/logging/logger');

var logger = new Logger(),
    chalk = require('chalk')
;

logger.verbosity = 2;
logger.styles = {
    warning: 'bold-yellow',
    error: 'red'
};
logger.chalk = chalk;

var tests = [
    {
        message: '<<grey>>-------------------------------------<</grey>>',
        verbosity: 0
    },
    {
        message: '<<red>>I am red<</red>>',
        verbosity: 0,
        indentation: 0
    },
    {
        message: 'I am <<red>>red<</red>> and <<blue>>blue<</blue>>',
        verbosity: 1,
        indentation: 0
    },
    {
        message: 'I am <<red-bgBlue>>red and bgBlue',
        verbosity: 2,
        indentation: 0
    },
    {
        message: 'I am <<red-bgBlue>>red and bgBlue then <</red>>only bgBlue',
        verbosity: 0,
        indentation: 0
    },
    {
        message: 'I am invisible',
        verbosity: 3
    },
    {
        message: 'I am indented and <<bold>>bold<</bold>>',
        verbosity: 0,
        indentation: 2
    },
    {
        message: 'I am <<green>><<green>>green<</green>> and <<yellow>>yellow<</green>><</yellow>>',
        verbosity: 0,
        indentation: 0
    },
    {
        message: 'I am <<warning>>a warning<</warning>> and <<bold-error>>an error',
        verbosity: 0
    },
    {
        message: '---<<error>>test ERRORED',
        length: 3
    },
    {
        message: '<<grey>>------------------------------------<</grey>>',
        verbosity: 0
    }
]

describe('Logger', function() {
    describe('method "log"', function() {
        tests.forEach(function(test) {
            it('should log to the console with the defined style', function() {
                logger.log(test.message, test.verbosity, test.indentation, test.length);
            })
        })
    })
})