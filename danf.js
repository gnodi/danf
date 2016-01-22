'use strict';

require('./lib/common/init');

var exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs')
;

// Retrieve gulp command path.
var gulpCommandPath = path.join(__dirname, 'node_modules/.bin/gulp');

try {
    fs.statSync(gulpCommandPath);
} catch (error) {
    // Handle not existing modules folder.
    if (!(error.code in {'ENOENT': true, 'ENOTDIR': true})) {
        throw error;
    }

    gulpCommandPath = path.join(__dirname, '../../node_modules/.bin/gulp');
}

// Handle "&&" separated commands.
var commands = process.argv.slice(2).join(' ').split('&&');

for (var i = 0; i < commands.length; i++) {
    var command = commands[i],
        commandParts = command.split(' '),
        task = commandParts[0]
    ;

    if (task in {'execute-cmd': true, '$': true}) {
        command = '{0} --cmd "{1}" {2}'.format(
            commandParts.shift(),
            commandParts.shift(),
            commandParts.join(' ')
        );
    }

    // Forward the task execution to gulp.
    var child = exec(
            '{0} {1}'.format(gulpCommandPath, command),
            function(error) {
                if (error !== null) {
                    console.log('Processing Error: ' + error);
                }
            }
        )
    ;

    child.stdout.on('data', function(data) {
        process.stdout.write(data);
    });
    child.stderr.on('data', function(data) {
        process.stdout.write('Error: ' + data);
    });
}