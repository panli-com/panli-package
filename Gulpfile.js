/**
 * Created by Administrator on 2015/9/11.
 */
// 引入 gulp
var gulp = require('gulp');
var react = require('gulp-react');

// 引入组件
//var jshint = require('gulp-jshint');
var sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    browserSync = require('browser-sync').create(),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    port = process.env.port || 5000;

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

// live reload
gulp.task('connect',function(){
    connect.server({
        // root:'./',
        port: port,
        livereload: true,
    })
})

// reload Js
gulp.task('js',function(){
    gulp.src('./dist/**/*.js')
        .pipe( connect.reload() )
})


gulp.task('html',function(){
    gulp.src('./*.html')
        .pipe( connect.reload() )
});

//react 编译

gulp.task('react', function () {
    return gulp.src('./src/login/js/main.js')
        .pipe(browserify({
            transform: 'reactify',
        }))
        .pipe(gulp.dest('./dist/login/js'));
});

// reload Js
gulp.task('js',function(){
    gulp.src('./dist/**/js/*.js')
        .pipe( connect.reload() )
        .pipe(notify({ message: 'reload Js Ok' }));
})
//编译Sass，Autoprefix及缩小化
gulp.task('common', function() {
    return gulp.src('./src/common/scss/panli.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/common/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/common/css'))
        .pipe( connect.reload() )
        .pipe(notify({ message: 'Styles Common task complete' }));
        /* gulp.src('./src/login/scss/!*.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/login/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/login/css'))
        .pipe(notify({ message: 'Styles task complete' }));*/
});

//编译Sass，Autoprefix及缩小化
gulp.task('login', function() {
    return gulp.src('./src/login/scss/login.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/login/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/login/css'))
        .pipe( connect.reload() )
        .pipe(notify({ message: 'Styles Login task complete' }));

});

gulp.task('scripts', function() {
    return gulp.src('./src/common/js/*.js')
        .pipe(concat('panli.js'))
        .pipe(gulp.dest('dist/common/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/common/js'))
        .pipe( connect.reload() )
        .pipe(notify({ message: 'Scripts task complete' }));
});


// 合并，压缩文件
/*gulp.task('js', function() {
    gulp.src('./src/js/!*.js')
        .pipe(concat('panli.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('panli.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});*/

// 默认任务
gulp.task('default', function(){
    //gulp.run( 'sass', 'js','browser-sync');
    gulp.run( 'styles', 'scripts');
    var server = livereload();
    /* // 监听文件变化
     gulp.watch('./src/!**!/!*.*', function(file){
     //gulp.run( 'sass', 'js','browser-sync');
     gulp.run( 'styles', 'scripts');

     });*/
});

/* 监听 */

gulp.task('watch', function() {

    // 看守所有.scss档
    gulp.watch('src/common/scss/*.scss', ['common']);
    gulp.watch('src/login/scss/*.scss', ['login']);

    // 看守所有.组件
    gulp.watch('src/common/js/*.js', ['scripts']);

    // 看守所有.js档
    gulp.watch('src/**/js/*.js', ['js']);
    // 看守所有. react
    gulp.watch('./src/login/js/*.js', ['react']);
    // 看守所有.html
    gulp.watch('./*.html',['html']);

});

gulp.task('serve',['react','connect','watch']);