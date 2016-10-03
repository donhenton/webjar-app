var gulp = require('gulp');




var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglifycss = require('gulp-uglifycss');
var reactify = require('reactify');
var babelify = require('babelify');
var browserify = require('browserify');
var argv = require('yargs').argv;

var envify = require('envify');



function notify(error) {
    var message = 'In: ';
    var title = 'Error: ';
    if (error.description) {
        title += error.description;
    } else if (error.message) {
        title += error.message;
    }

    if (error.filename) {
        var file = error.filename.split('/');
        message += file[file.length - 1];
    }

    if (error.lineNumber) {
        message += '\nOn Line: ' + error.lineNumber;
    }
    console.log(error);
}


var mainApp = {};
mainApp.treeLocation = '/jsapp/';
mainApp.sourceBase = './src/main/resources/'+ mainApp.treeLocation;
//argv.dir is full path to target folder
mainApp.targetWebappFolder =  argv.dir+ mainApp.treeLocation;

function mainAppBundle() {

    var mainAppBundler = browserify({
        entries: [ mainApp.sourceBase+ 'app.js'],
        transform: [["babelify", {"presets": ["es2015", "react"]}], ["envify", {NODE_ENV: 'production', 'global': true, '_': 'purge', }]],
        extensions: ['.js'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });


    return mainAppBundler
            .bundle()
            .on('error', notify);

}


gulp.task('build-main-app', function () {
    mainAppBundle()
            .pipe(source('main_app.min.js'))
            .pipe(streamify(uglify()))
            .pipe(gulp.dest(mainApp.targetWebappFolder));
});

gulp.task('sass-main-app', function () {
    gulp.src(mainApp.sourceBase+'sass/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(concat('main_app_style.css'))
            .pipe(gulp.dest(mainApp.targetWebappFolder));
});


gulp.task('default',['build-main-app', 'sass-main-app']);