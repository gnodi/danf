'use strict';

require('./lib/common/init');

var spawn = require('child_process').spawn,
    path = require('path'),
    chalk = require('chalk'),
    Logger = require('./lib/common/logging/logger')
;

var logger = new Logger();

logger.chalk = chalk;

module.exports = Gulp;

function Gulp(gulp) {
    if (gulp) {
        this.init(gulp);
    }
}

Gulp.prototype.init = function(gulp) {
    var self = this;

    // Display info on available tasks.
    gulp.task('default', function() {
        logger.log('<<blue>>Start a <<bold>>server<</bold>>:');
        logger.log('<<grey>>$<</grey>> node danf serve', 0, 1);
        logger.log('<<blue>>Execute a <<bold>>command<</bold>>:');
        logger.log('<<grey>>$<</grey>> node danf $ my-command --foo bar', 0, 1);
    });

    // Start a server.
    gulp.task('serve', function(done) {
        // Forward the task in order to not create a gulp cluster.
        var child = spawn(
                'node',
                [require.resolve('./main')].concat(process.argv),
                {
                    cwd: process.cwd()
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
    });

    // Execute a command.
    gulp.task('$', function(done) {
        self.executeCommand(done)
    });
}

Gulp.prototype.executeCommand = function(done) {
    var net = require('net');

    var self = this,
        command = this.parseCommandLine()
    ;

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
            if (null == command.app.server.context.cluster) {
                command.app.server.context.cluster = {};
            }
            command.app.server.context.cluster.active = false;

            self.buildServer(command, function(app) {
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
}

Gulp.prototype.getAppBuilder = function(command) {
    return require('./index')(
            command.app.server.configuration,
            command.app.client.configuration,
            command.app.server.context,
            command.app.client.context
        )
    ;
}

Gulp.prototype.buildServer = function(command, callback) {
    var danf = this.getAppBuilder(command);

    danf.buildServer(callback);
}

Gulp.prototype.buildClient = function(command, callback) {
    var danf = this.getAppBuilder(command);

    danf.buildClient(callback);
}

Gulp.prototype.parseCommandLine = function() {
    var line = process.argv.slice(4).join(' ').replace(' ', ''),
        envOption = line.match(/--env\s([^\s]+)+/),
        portOption = line.match(/--port\s([^\s]+)/),
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