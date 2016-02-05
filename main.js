'use strict';

var Gulp = require('./gulp');

var gulp = new Gulp();

gulp.buildServer(function(app) {
    app.listen();
});