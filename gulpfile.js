var gulp = require('gulp');



var gutil = require('gulp-util');
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
var server = require('gulp-server-livereload');
var livereload = require('gulp-livereload');
var envify = require('envify');
var gulpsync = require('gulp-sync')(gulp);
var watch = require('gulp-watch');



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
mainApp.sourceBase = './src/main/resources/' + mainApp.treeLocation;
var buildDir = mainApp.sourceBase+'public_html/build';
var pageURL = 'http://127.0.0.1:8080';
var srcDir = mainApp.sourceBase +"src/";
var SASS_FILES = srcDir + '/sass/**/*.scss';
var WATCH_JS = [srcDir +'/react/**/*.js',srcDir+'/app.js'];
var HTML_FILES = [mainApp.sourceBase+"public_html/index.html"];
var cssAssetsLocation = mainApp.sourceBase +"css/**/*";
var imagesLocation = mainApp.sourceBase +"user_images/**/*";

//argv.dir is full path to target folder
mainApp.targetWebappFolder = argv.dir + mainApp.treeLocation;

function mainAppBundle() {

    var mainAppBundler = browserify({
        entries: [srcDir + 'app.js'],
        transform: [["babelify", {"presets": ["es2015", "react"]}], ["envify", {NODE_ENV: 'production', 'global': true, '_': 'purge', }]],
        extensions: ['.js'],
        debug: false,
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
    gulp.src(SASS_FILES)
            .pipe(sass().on('error', sass.logError))
            .pipe(concat('main_app_style.css'))
            .pipe(gulp.dest(mainApp.targetWebappFolder));
});
gulp.task('copy-css-assets', function () {
    gulp.src(cssAssetsLocation)
             
             
            .pipe(gulp.dest(mainApp.targetWebappFolder));
});

gulp.task('copy-images', function () {
    gulp.src(imagesLocation)
             
             
            .pipe(gulp.dest(mainApp.targetWebappFolder+"images/user_images"));
});


gulp.task('default', ['build-main-app', 'sass-main-app','copy-css-assets','copy-images']);

///////////////////development////////////////////////////


var sassProcess =
        function () {

            return gulp.src(SASS_FILES)
                    .pipe(sass().on('error', sass.logError))
                    .pipe(concat('style.css'))
                    .pipe(gulp.dest(buildDir+"/css"));
        };



gulp.task('build-js', function () {
    function devBundle() {

        var devBundler = browserify({
             entries: [srcDir + 'app.js'],
            transform: [["babelify", {"presets": ["es2015", "react"]}]],
            extensions: ['.js'],
            debug: true,
            cache: {},
            packageCache: {},
            fullPaths: true
        });


        return devBundler
                .bundle()
                .on('error', notify);

    }

    devBundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(buildDir))
            .on('finish', function ( ) {
                gutil.log("build bundle end");
                livereload.reload(pageURL);
            });


});
 
 
 gulp.task('watch', function () {

    watch(SASS_FILES, function (events, done) {

        sassProcess()
                .on('finish', function ( ) {
                    gutil.log("processing change in css");
                    livereload.reload(pageURL);
                });

    });

    watch(WATCH_JS, function (events, done) {

        gulp.start('build-js');
    });

    watch(HTML_FILES, function (events, done) {
        gutil.log("starting html change");
        livereload.reload(pageURL);
    });

});


gulp.task('serve', function (done) {
   // livereload.listen();
    gulp.src(mainApp.sourceBase+'public_html').on('error', gutil.log)
            .pipe(server({
                livereload: {
                    enable: true
                },
                host: '127.0.0.1',
                port: 8080,
                defaultFile: 'index.html',
                directoryListing: false,
                open: true
            }));
});

gulp.task('dev', gulpsync.sync(['build-js','watch', 'serve']),function(done)
{
    console.log("finished dev")
});