'use strict';

require('./lib/common/init');

var spawn = require('child_process').spawn,
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
        command = '{0} --cmd {1} {2}'.format(
            commandParts.shift(),
            commandParts.shift(),
            commandParts.join(' ')
        );
    }

    var args = process.argv.slice(2, 3).concat(['--colors']).concat(process.argv.slice(3));

    for (var j = 1; j < args.length; j++) {
        // Escape value parameter to avoid being interpreted as a task by gulp.
        if (/^[^-"]/.test(args[j])) {
            args[j] = '---{0}'.format(args[j]);
        }
    }

    // Forward the task execution to gulp.
    var child = spawn(
            gulpCommandPath,
            args,
            {
                cwd: path.dirname(require.main.filename)
            }
        ),
        errored = false;
    ;

    child.stdout.on('data', function(data) {
        process.stdout.write(data);
    });
    child.stderr.on('data', function(data) {
        errored = true;
        process.stdout.write(data);
    });
    child.on('close', function(data) {
        process.exit(errored ? 1 : 0);
    });
    child.on('exit', function(data) {
        process.exit(errored ? 1 : 0);
    });
}