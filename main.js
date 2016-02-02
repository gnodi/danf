'use strict';

var Gulp = require('./gulp');

var gulp = new Gulp(),
    command = gulp.parseCommandLine()
;

gulp.buildServer(command, function(app) {
    app.listen();
});