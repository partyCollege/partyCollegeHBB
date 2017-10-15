/**
  * 组件安装
  * npm install gulp-util gulp-imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev
    启动监视JS改动命令，gulp watch
    每次当Templats目录下有JS改动则会自动合并./dist/js/Controller.js
    所以应确保angularjs的引导页引用此JS文件
  */

// 引入 gulp及组件
var gulp = require('gulp'),                 //基础库
     imagemin = require('gulp-imagemin'),       //图片压缩
     sass = require('gulp-ruby-sass'),          //sass
     minifycss = require('gulp-minify-css'),    //css压缩
     //jshint = require('gulp-jshint'),           //js检查
     uglify = require('gulp-uglify'),          //js压缩
     rename = require('gulp-rename'),           //重命名
     concat = require('gulp-concat'),          //合并文件
     clean = require('gulp-clean'),             //清空文件夹
     tinylr = require('tiny-lr'),               //livereload
     server = tinylr(),
     port = 35731,
     livereload = require('gulp-livereload');  //livereload 

// HTML处理
gulp.task('html', function () {
    var htmlSrc = './Templates/**/*.html',
        htmlDst = './dist/';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});

// 样式处理
gulp.task('css', function () {
    var cssSrc = './src/scss/*.scss',
        cssDst = './dist/css';

    gulp.src(cssSrc)
        .pipe(sass({ style: 'expanded' }))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function () {
    var imgSrc = './src/images/**/*',
        imgDst = './dist/images';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
})

// js处理
gulp.task('backjs', function () {
    var jsSrc = './Templates/back/**/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('backControllers.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// js_directives
gulp.task('directivesjs', function () {
    var jsSrc = './Scripts/directives/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('appDirectives.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// js_servicejs
gulp.task('servicejs', function () {
	var jsSrc = './Scripts/services/*.js',
        jsDst = './dist/js';

	gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('appServices.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// js_servicejs
gulp.task('filtersjs', function () {
	var jsSrc = './Scripts/filters/*.js',
        jsDst = './dist/js';

	gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('appFilters.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});
 
// js处理
gulp.task('videojs', function () {
    var jsSrc = './Templates/videoCourse/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('videoControllers.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

gulp.task('studentjs', function () {
    var jsSrc = './Templates/student/**/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('studentControllers.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});
 
// js处理
gulp.task('mainjs', function () {
    var jsSrc = './Templates/main/**/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('mainControllers.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// js处理
gulp.task('frontjs', function () {
    var jsSrc = './Templates/front/**/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('frontControllers.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// js处理
gulp.task('publicjs', function () {
    var jsSrc = './Templates/public/**/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('publicControllers.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});
// js处理
gulp.task('videojs', function () {
    var jsSrc = './Templates/videoCourse/*.js',
        jsDst = './dist/js';

    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('videoControllers.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// 清空图片、样式、js
gulp.task('clean', function () {
    gulp.src(['./dist/css', './dist/js', './dist/images'], { read: false })
        .pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function () {
    gulp.start('html', 'css', 'images', 'js');
});

gulp.task("js", function () { 
    gulp.run("studentjs");
    gulp.run("mainjs");
    gulp.run("frontjs");
    gulp.run("backjs");
    gulp.run("publicjs");
    gulp.run("servicejs");
    gulp.run("filtersjs");
    gulp.run("directivesjs");
    gulp.run("videojs");
});

function doTask(category) {
    gulp.run(category);
}

// 监听任务 运行语句 gulp watch
gulp.task('watch', function () {

    server.listen(port, function (err) {
        if (err) {
            return console.log(err);
        }
         
        gulp.watch('./Scripts/directives/*.js', function () { 
            doTask("directivesjs");
        });
        gulp.watch('./Scripts/filters/*.js', function () {
        	doTask("filtersjs");
        });
        gulp.watch('./Scripts/services/*.js', function () {
        	doTask("servicejs");
        });
        gulp.watch('./Templates/student/**/*.js', function () { 
            doTask("studentjs");
        });
        gulp.watch('./Templates/main/**/*.js', function () { 
            doTask("mainjs");
        });
        gulp.watch('./Templates/public/**/*.js', function () {
            doTask("publicjs");
        });
        gulp.watch('./Templates/front/**/*.js', function () {
            doTask("frontjs");
        });
        gulp.watch('./Templates/back/**/*.js', function () {
        	doTask("backjs");
        });
        gulp.watch('./Templates/videoCourse/*.js', function () {
            //gulp.run('js',"main");
            doTask("videojs");
        });
    });
});