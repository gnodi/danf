'use strict';

require('../../../../../lib/common/init');

var assert = require('assert'),
    exec = require('child_process').exec,
    path = require('path')
;

describe('Command notifier', function() {
    it('should be able to process a command', function(done) {
        exec(
            'node danf $ test --silent --env test --foo bar --bar 1 2 3 --foobar foo bar',
            {
                cwd: path.join(__dirname, '../../../../fixture/command')
            },
            function(err, stdout, stderr) {
                if (stderr) {
                    err = new Error(stderr.toString('utf8'));
                }
                if (err) {
                    throw err;
                }

                assert.equal(
                    stdout.toString('utf8').replace("\r", '').replace("\n", ''),
                    'foo bar bar 6'
                );

                done();
            }
        );
    })
})