var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-minify-css'),
    cssver = require('gulp-make-css-url-version'),
    rev = require('gulp-rev-append'),
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    //imagemin = require('gulp-imagemin'),
    //pngquant = require('imagemin-pngquant'),
    runSequence = require('run-sequence'),
    webserver = require('gulp-webserver'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    /* preprocess = require('gulp-preprocess'),*/
    fs = require("fs");
var version = new Date().getTime();
//清除文件
gulp.task('build-clean', function () {
    return del(['./dist/*'])
})

//合并插件
gulp.task("script-build", function () {

    /*    gulp.src(['./src/source/lib/ligerUI/js/core/!*.js','./src/source/lib/ligerUI/js/plugins/!*.js'])
            .pipe(concat('ligerui.all.1.3.3.js'))
            //.pipe(rev())
            .pipe(replace('@@hash', version)) // 替换路径
            // .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest('./src/source/lib/ligerUI/js'));*/


})
gulp.task('html-build', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        //collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        //removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        //removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };

    gulp.src(['./src/views/**/*.html'])
        .pipe(rev())
        /* .pipe(replace('@@hash', (new Date().getTime()))) // 替换路径*/
        .pipe(replace('@@hash', version)) // 替换路径
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/src/views'));

    gulp.src(['./src/views/**/*.js'])
        .pipe(babel({
            presets: ['es2015'] // es5检查机制
        }))
        .pipe(uglify())
        .on('error', function (err) {
            //  gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('./dist/src/views'));
    gulp.src(['./src/source/scripts/lib/model/*.js'])
    /*.pipe(babel({
        presets: ['es2015'] // es5检查机制
    }))*/
        .pipe(uglify())
        .on('error', function (err) {
            // gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('./dist/src/source/scripts/lib/model'));


});

gulp.task('script-sass', function () {
    return gulp.src('./src/source/themes/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/source/themes'));
});


gulp.task('move-all', function () {
    return gulp.src(['./src/**/*'])
        .pipe(gulp.dest('./dist/src'));
})
gulp.task('build', ["build-clean"], function () {
    runSequence("move-all", "html-build", 'script-sass');
})
gulp.task("default", ["build"]);
