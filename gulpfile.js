/**
 Gulpfile for gulp-webpack-demo
 created by fwon
*/

var gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    connect = require('gulp-connect'),
    through = require('through2'),
    replace = require('gulp-replace'),
    rename  = require('gulp-rename');
    proxy = require('http-proxy-middleware');
var host = {
    path: 'dist/',
    port: 5555,
    html: 'index.html'
};
//mac chrome: "Google chrome",
var browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));
var pkg = require('./package.json');
String.prototype.firstUpperCase = function(){
    return this.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
        return $1.toUpperCase() + $2.toLowerCase();
    });
}
//将图片拷贝到目标目录
gulp.task('copy:images', function (done) {
    gulp.src(['src/Public/images/**/*']).pipe(gulp.dest('dist/Public/images')).on('end', done);
});
//将图片拷贝到目标目录
gulp.task('copy:mock', function (done) {
    gulp.src(['src/Public/mock/**/*']).pipe(gulp.dest('dist/Public/mock')).on('end', done);
});

//压缩合并css, css中既有自己写的.less, 也有引入第三方库的.css
gulp.task('lessmin', function (done) {
    gulp.src(['src/Public/css/main.less', 'src/Public/css/*.css'])
        .pipe(less())
        //这里可以加css sprite 让每一个css合并为一个雪碧图
        //.pipe(spriter({}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/Public/css/'))
        .on('end', done);
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['build-js'], function (done) {
    gulp.src('dist/Public/js/*.js')
        .pipe(md5(10, 'dist/**/*.html'))
        .pipe(gulp.dest('dist/Public/js'))
        .on('end', done);
});

//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task('md5:css', ['sprite'], function (done) {
    gulp.src('dist/Public/css/*.css')
        .pipe(md5(10, 'dist/**/*.html'))
        .pipe(gulp.dest('dist/Public/css'))
        .pipe(connect.reload())
        .on('end', done);
});

//用于在html文件中直接include文件
gulp.task('fileinclude', function (done) {
    gulp.src(['src/app/*.html'])
        // .pipe(gulp.dest('dist'))
        .pipe(through.obj(function(file,enc,cb){
            console.log('file.relative', file.relative);
            console.log('file.path', file.path);
            this.push(file);
            var _nameArr = file.relative.split('.');
            if (_nameArr[1] == 'html') {
              gulp.src(file.path)
              .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
              }))
              .pipe(rename(_nameArr[0].firstUpperCase() + '/index.html'))
              .pipe(gulp.dest('dist'))
            }
            cb();
        }))
        .pipe(connect.reload())
        .on('end', done);
        // .pipe(connect.reload())
});
gulp.task("reloadFile", function(callback) {
  gulp.src(['dist/**/*.html'])
      .pipe(through.obj(function(file,enc,cb){
          console.log('file.relative', file.relative);
          console.log('file.path', file.path);
          this.push(file);
          var _nameArr = file.relative.split('.');
          if (_nameArr[1] == 'html') {
            gulp.src(file.path)
            .pipe(rename(_nameArr[0].firstUpperCase() + '/index.html'))
            .pipe(gulp.dest('dist'))
          }
          cb();
      }))
})
//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:images', 'lessmin'], function (done) {
    var timestamp = +new Date();
    gulp.src('dist/Public/css/style.min.css')
        .pipe(spriter({
            spriteSheet: 'dist/Public/images/spritesheet' + timestamp + '.png',
            pathToSpriteSheetFromCSS: '../images/spritesheet' + timestamp + '.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/Public/css'))
        .on('end', done);
});

gulp.task('clean', function (done) {
    gulp.src(['dist'])
        .pipe(clean())
        .on('end', done);
});

gulp.task('watch', function (done) {
    gulp.watch('src/**/*', ['lessmin', 'build-js', 'fileinclude', 'copy:mock', 'reload'])
        .on('end', done);
});
gulp.task('reload', function () {
  connect.reload()
})
gulp.task('connect', function () {
    console.log('connect------------');
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/api',  {
                    target: 'http://jp.freedaigou.cn',
                    changeOrigin:true
                }),
                proxy('/spider', {
                    target: 'http://spider.jipaimall.com',
                    changeOrigin:true
                })
            ]
        }
    });
});

gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://127.0.0.1:5555/index'
        }))
        .on('end', done);
});

var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
gulp.task("build-js", ['fileinclude'], function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        connect.reload();
        callback();
    });
});

gulp.task("ftp", function(callback) {
    gulp.src('dist/css/*.css')
        .pipe(gulp.dest('yahoofpt/Public/css'))
    gulp.src('dist/js/*.js')
        .pipe(gulp.dest('yahoofpt/Public/js'))
    gulp.src('dist/images/*')
        .pipe(gulp.dest('yahoofpt/Public/images'))
    gulp.src('dist/app/*')
        .pipe(through.obj(function(file,enc,cb){
            console.log(file.relative);
            console.log(file.path.split('.')[0]);
            var name = file.relative.split('.');
            if (name[1] == 'html') {
                gulp.src('dist/app/'+ file.relative)
                .pipe(replace(/(src|href)\=\"\.\.\/((js|css|images)\/.+\.(js|css|png|jpg|gif|html))\"/g, '$1="../Public/$2"'))
                .pipe(rename(name[0].firstUpperCase() + '/index.html'))
                .pipe(gulp.dest('yahoofpt'))
            }
            this.push(file);
            cb();
        }));
});

//发布
gulp.task('default', ['connect', 'fileinclude', 'md5:css', 'md5:js', 'open']);

//开发
gulp.task('dev', ['connect', 'copy:images', 'copy:mock', 'fileinclude', 'lessmin', 'build-js', 'watch', 'open']);
