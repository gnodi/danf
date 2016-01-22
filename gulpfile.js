'use strict';

require('./lib/common/init');

var gulp = require('gulp');

var commandServer = {
        port: 3090
    }
;

gulp.task('default', function(done) {
    // TODO: describe available tasks.
});

// Start a command server.
gulp.task('serve-cmd', function(done) {
    var net = require('net');

    var server = net.createServer(function(socket) {});

    server.on('error', function(error) {
        if (error.code == 'EADDRINUSE') {
            console.log('Port {0} already in use.'.format(commandServer.port));
        }
    });
    server.on('connection', function(socket) {
        socket.write('> Connected to command server on port {0}.'.format(commandServer.port));

        socket.on('data', function(data) {
            // TODO: execute a command.
            console.log(data.toString('utf8'));
        });
    });
    // Listen for commands.
    server.listen(commandServer.port, function() {
        console.log('Command server listening on port {0}...'.format(commandServer.port));
    });
});

// Execute a command.
gulp.task('execute-cmd', function(done) {
    var net = require('net');
    var args = process.argv.slice(2).join(' ');

    // Try to connect to a command server.
    var client = net.connect({port: commandServer.port}, function() {
        client.write(process.argv.slice(3).join(' '));
    });

    client.on('error', function(error) {
        // Execute a standalone command if no command server is listening.
        if ('ECONNREFUSED' === error.code) {
            console.log('You are executing a standalone command. To maximize the performances, start a command server with `node danf serve-cmd`.');

            // TODO: execute a standalone command.
            done();
        } else {
            throw error;
        }
    });
    client.on('data', function(data) {
        console.log(data.toString());
        client.end();
    });
    client.on('end', function() {
        console.log('> Disconnected from command server.');
        done();
    });
});

// Execute a command (shorcut).
gulp.task('$', ['execute-cmd'], function() {
});