var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    /*   babel = require('gulp-babel'),*/
    webserver = require('gulp-webserver'),
    /*preprocess = require('gulp-preprocess'),*/
    jshint = require('gulp-jshint');

gulp.task('script-lint', function () {
    return gulp.src('./src/views/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('script-sass', function () {
    return gulp.src('./src/source/themes/common/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/source/themes/common/'));
});


gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: true,
            directoryListing: true,
            port: 8091,
            // host:'localhost',
            open: 'http://127.0.0.1:8091/src/views/index.html'
        }));
});

gulp.task('watch', function () {
    gulp.watch([
        './src/views/**/*.js',
        './src/source/themes/common/*.scss'
    ], ['script-lint', 'script-sass'])
})
gulp.task("default", ['webserver', 'watch', 'script-sass', 'script-lint']);
