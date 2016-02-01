'use strict';

require('./lib/common/init');

var path = require('path'),
    chalk = require('chalk'),
    Logger = require('./lib/common/logging/logger')
;

var logger = new Logger();

logger.chalk = chalk;

module.exports = function(gulp) {
    gulp.task('default', function(done) {
        // TODO: describe available tasks.
    });

    // Start a HTTP server.
    gulp.task('serve-http', function(done) {
        var command = parseCommandLine();

        buildServer(command, function(app) {
            app.listenHttp(done);
        });
    });

    // Start a command server.
    gulp.task('serve-cmd', function(done) {
        var command = parseCommandLine();

        buildServer(command, function(app) {
            app.listenCmd(done);
        });
    });

    // Execute a command.
    gulp.task('execute-cmd', function(done) {
        var net = require('net');

        var command = parseCommandLine();

        // Try to connect to a command server.
        logger.log('<<grey>>[client] <<yellow>>Trying to connect to command server...');

        var client = net.connect({port: command.port}, function() {
            client.write(command.line);
        });

        client.on('error', function(error) {
            // Execute a standalone command if no command server is listening.
            logger.log('<<grey>>[client] <<red>>Failed to connect.')

            if ('ECONNREFUSED' === error.code) {
                logger.log('<<grey>>[client] <<yellow>>You are executing a standalone command. To maximize the performances, start a command server with `node danf serve-cmd`.');

                // Execute a standalone command.
                command.app.server.context.clustered = false;

                buildServer(command, function(app) {
                    app.executeCmd(command.line, function() {
                        logger.log('<<grey>>[client]<</grey>> <<yellow>>Command processing ended.');
                        done();

                        // Wait for all stdout to be sent to parent process.
                        setTimeout(
                            function() {
                                process.exit(0);
                            },
                            2000
                        );
                    });
                });
            } else {
                throw error;
            }
        });
        client.on('data', function(data) {
            logger.log('<<grey>>[server]<</grey>> {0}'.format(data.toString()));
        });
        client.on('end', function() {
            logger.log('<<grey>>[client]<</grey>> <<yellow>>Command processing ended.');
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
        envOption = line.match(/--env\s([^\s])+/),
        portOption = line.match(/--port\s([^\s])+/),
        environment = envOption ? envOption[1] : 'dev',
        port = portOption ? portOption[1] : 3111
    ;

    return {
        line: line
            .replace(/\s--env\s([^\s])+/, '')
            .replace(/\s--port\s([^\s])+/, '')
            .replace(/\s--colors/, '')
        ,
        app: require(path.join(
            process.cwd(),
            'app-{0}'.format(environment)
        )),
        env: environment,
        port: port
    };
}