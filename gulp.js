'use strict';

require('./lib/common/init');

var path = require('path');

module.exports = function(gulp) {
    var commandServer = {
            port: 3090
        }
    ;

    gulp.task('default', function(done) {
        // TODO: describe available tasks.
    });

    // Start a HTTP server.
    gulp.task('serve-http', function(done) {
        var app = buildServer();

        app.listenHttp(done);
    });

    // Start a command server.
    gulp.task('serve-cmd', function(done) {
        var app = buildServer();

        app.listenCmd(done);
        /*var net = require('net');

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
        });*/
    });

    // Execute a command.
    gulp.task('execute-cmd', function(done) {
        var net = require('net');

        var command = parseCommandLine();

        // Try to connect to a command server.
        var client = net.connect({port: commandServer.port}, function() {
            client.write(command.line);
        });

        client.on('error', function(error) {
            // Execute a standalone command if no command server is listening.
            if ('ECONNREFUSED' === error.code) {
                console.log('You are executing a standalone command. To maximize the performances, start a command server with `node danf serve-cmd`.');

                // Execute a standalone command.
                command.app.server.context.clustered = false;

                buildServer(command, function(app) {
                    app.executeCmd(command.line, function() {
                        done();
                        // Wait for all stdout to be sent to parent process.
                        setTimeout(
                            function() {
                                process.exit(0);
                            },
                            1000
                        );
                    });
                });
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
}

function getAppBuilder(command) {
    return require('./index')(
            command.app.server.configuration,
            command.app.client.configuration,
            command.app.server.context,
            command.app.client.context
        )
    ;
}

function buildServer(command, callback) {
    var danf = getAppBuilder(command);

    danf.buildServer(callback);
}

function buildClient(command, callback) {
    var danf = getAppBuilder(command);

    danf.buildClient(callback);
}

function parseCommandLine() {
    var line = process.argv.slice(4).join(' ').replace(' ', ''),
        env = line.match(/--env\s([^\s])+/),
        environment = env ? env[1] : 'dev'
    ;

    return {
        line: line.replace(/\s--env\s([^\s])+/, '').replace(/\s--colors/, ''),
        app: require(path.join(
            process.cwd(),
            'app-{0}'.format(environment)
        ))
    };
}