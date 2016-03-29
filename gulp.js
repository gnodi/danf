'use strict';

require('./lib/common/init');

var spawn = require('child_process').spawn,
    path = require('path'),
    chalk = require('chalk'),
    Logger = require('./lib/common/logging/logger')
;

var logger = new Logger();

logger.chalk = chalk;
logger.verbosity = 1;

module.exports = Gulp;

function Gulp(gulp) {
    if (gulp) {
        this.init(gulp);
    }
}

Gulp.prototype.init = function(gulp) {
    var self = this,
        server,
        serverStopped = false
    ;

    // Display info on available tasks.
    gulp.task('default', function() {
        logger.log('<<blue>>Start a <<bold>>server<</bold>>:');
        logger.log('<<grey>>$<</grey>> node danf serve', 0, 1);
        logger.log('<<blue>>Execute a <<bold>>command<</bold>>:');
        logger.log('<<grey>>$<</grey>> node danf $ my-command --foo bar', 0, 1);
    });

    // Execute a command.
    gulp.task('$', function(done) {
        self.executeCommand(done)
    });

    // Start a self watching server with a fresh client.
    gulp.task('serve', ['watch', 'build-client', 'start-server'], function() {
    });

    // Build client.
    gulp.task('watch', function(done) {
        var options = {
                interval: 700
            }
        ;

        // Watch for client modifications.
        this.watch(
            [
                './node_modules/danf/lib/client/main.js',
                './node_modules/danf/lib/common/**/*.js',
                './node_modules/danf/lib/client/**/*.js',
                './node_modules/danf/config/common/**/*.js',
                './node_modules/danf/config/client/**/*.js',
                './node_modules/danf/resource/public/**/*.js'
            ],
            options,
            ['build-client-danf', 'build-client-config']
        );
        this.watch(
            [
                './*.js',
                './lib/common/**/*.js',
                './lib/client/**/*.js',
                './config/common/**/*.js',
                './config/client/**/*.js',
                './resource/public/**/*.js'
            ],
            options,
            ['build-client-app']
        );
        this.watch(
            './node_modules/danf/lib/common/init.js',
            options,
            ['build-client-init']
        );

        // Watch for server modifications.
        this.watch(
            [
                './*.js',
                './lib/common/**/*.js',
                './lib/server/**/*.js',
                './config/common/**/*.js',
                './config/server/**/*.js',
                './resource/private/**/*.js',
                './node_modules/danf/*.js',
                './node_modules/danf/lib/common/**/*.js',
                './node_modules/danf/lib/server/**/*.js',
                './node_modules/danf/config/common/**/*.js',
                './node_modules/danf/config/server/**/*.js',
                './node_modules/danf/resource/private/**/*.js'
            ],
            options,
            ['start-server']
        );
    });

    // Build client.
    gulp.task('build-client', function(done) {
        self.buildClient(function() {
            done();
        });
    });

    // Build client danf file.
    gulp.task('build-client-danf', function(done) {
        logger.log('<<magenta>><<bold>>Client danf file<</bold>> rebuilding...');

        var danf = self.prepareBuilder(false);

        danf.buildClientParts(
            ['danf'],
            done
        );
    });

    // Build client app file.
    gulp.task('build-client-app', function(done) {
        logger.log('<<magenta>><<bold>>Client app file<</bold>> rebuilding...');

        var danf = self.prepareBuilder(false);

        danf.buildClientParts(
            ['app'],
            done
        );
    });

    // Build client init file.
    gulp.task('build-client-init', function(done) {
        logger.log('<<magenta>><<bold>>Client init file<</bold>> rebuilding...');

        var danf = self.prepareBuilder(false);

        danf.buildClientParts(
            ['init'],
            done
        );
    });

    // Build client require file.
    gulp.task('build-client-require', function(done) {
        logger.log('<<magenta>><<bold>>Client require file<</bold>> rebuilding...');

        var danf = self.prepareBuilder(false);

        danf.buildClientParts(
            ['require'],
            done
        );
    });

    // Build client jquery file.
    gulp.task('build-client-jquery', function(done) {
        logger.log('<<magenta>><<bold>>Client jquery file<</bold>> rebuilding...');

        var danf = self.prepareBuilder(false);

        danf.buildClientParts(
            ['jquery'],
            done
        );
    });

    // Build client config file.
    gulp.task('build-client-config', function(done) {
        logger.log('<<magenta>><<bold>>Client config file<</bold>> rebuilding...');

        var danf = self.prepareBuilder(false);

        danf.buildClientParts(
            ['config'],
            done
        );
    });

    // Start a server.
    gulp.task('start-server', function(done) {
        var hasProcessedDone = false;

        // Kill existing server.
        if (server) {
            server.kill();
            serverStopped = true;
        }

        if (serverStopped) {
            logger.log('<<magenta>><<bold>>Server<</bold>> restarting...');
            serverStopped = false;
        }

        // Forward the task in order to not create a gulp cluster.
        server = spawn(
            'node',
            [require.resolve('./main')].concat(process.argv),
            {
                cwd: process.cwd()
            }
        );

        server.stdout.on('data', function(data) {
            process.stdout.write(data);

            if (
                -1 !== data.toString('utf8').indexOf('__________') &&
                !hasProcessedDone
            ) {
                hasProcessedDone = true;
                done();
            }
        });
        server.stderr.on('data', function(data) {
            process.stderr.write(data);
        });
        server.on('close', function(code, signal) {
            if (!hasProcessedDone) {
                hasProcessedDone = true;
                done();
            }

            if (code >= 1) {
                logger.log('<<red>>An error occured during server starting. Waiting for correction...');
                serverStopped = true;
            }
        });
    });

    process.on('close', function() {
        if (server) {
            server.kill();
        }
    });
}

Gulp.prototype.executeCommand = function(done) {
    var net = require('net');

    var self = this,
        command = this.parseCommandLine(),
        verbosity = command.silent ? 10 : 1
    ;

    // Try to connect to a command server.
    logger.log('<<grey>>[client] <<yellow>>Trying to connect to command server...', verbosity);

    var client = net.connect({port: command.port}, function() {
            client.write(command.line);
        }),
        standalone = false
    ;

    client.on('error', function(error) {
        // Execute a standalone command if no command server is listening.
        if ('ECONNREFUSED' === error.code) {
            standalone = true;

            logger.log('<<grey>>[client] <<red>>Failed to connect.', verbosity)
            logger.log('<<grey>>[client] <<yellow>>You are executing a standalone command. To maximize the performances, start a command server with `node danf serve`.', verbosity);

            // Execute a standalone command.
            var danf = self.prepareBuilder(false);

            danf.buildServer(function(app) {
                app.executeCmd(command.line, function() {
                    logger.log('<<grey>>[client]<</grey>> <<yellow>>Command processing ended.', verbosity);
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
        logger.log('<<grey>>[server]<</grey>> {0}'.format(data.toString()), verbosity);
    });
    client.on('close', function() {
        logger.log('<<grey>>[client]<</grey>> <<yellow>>Command processing ended.', verbosity);

        if (!standalone) {
            done();
        }
    });
}

Gulp.prototype.buildServer = function(callback) {
    var danf = this.prepareBuilder();

    danf.buildServer(callback);
}

Gulp.prototype.buildClient = function(callback) {
    var danf = this.prepareBuilder(false);

    danf.buildClient(callback);
}

Gulp.prototype.prepareBuilder = function(clustered) {
    var command = this.parseCommandLine();

    if (!clustered && undefined !== clustered) {
        if (null == command.app.server.context.cluster) {
            command.app.server.context.cluster = {};
        }
        command.app.server.context.cluster = null;
    }

    return this.getAppBuilder(command);
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

Gulp.prototype.parseCommandLine = function() {
    var line = process.argv.slice(4).join(' ').replace(' ', ''),
        envOption = line.match(/\s--env\s([^\s]+)+/),
        portOption = line.match(/\s--port\s([^\s]+)/),
        environment = envOption ? envOption[1].replace(/^---/, '') : 'dev',
        port = portOption ? portOption[1].replace(/^---/, '') : 3111,
        silent = line.match(/\s--silent/)
    ;

    return {
        line: line
            .replace(/\s--env\s([^\s])+/, '')
            .replace(/\s--port\s([^\s])+/, '')
            .replace(/\s--colors/, '')
            .replace(/\s--silent/, '')
        ,
        app: require(path.join(
            process.cwd(),
            'app-{0}'.format(environment)
        )),
        env: environment,
        port: port,
        silent: silent
    };
}