/**
 * Created by Administrator on 2015/9/11.
 */
// 引入 gulp
var gulp = require('gulp');

// 引入组件
//var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

// 检查脚本
//gulp.task('lint', function() {
//    gulp.src('./js/*.js')
//        .pipe(jshint())
//        .pipe(jshint.reporter('default'));
//});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});


// 编译Sass
gulp.task('sass', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'));
});

// 合并，压缩文件
gulp.task('js', function() {
    gulp.src('./src/js/*.js')
        .pipe(concat('panli.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('panli.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// 默认任务
gulp.task('default', function(){
    gulp.run( 'sass', 'js','browser-sync');

    // 监听文件变化
    gulp.watch('*', function(){
        gulp.run( 'sass', 'js','browser-sync');
    });
});