var gulp        = require('gulp');
var bowerFiles	= require('main-bower-files');
var inject 		= require("gulp-inject");

var concat 		= require('gulp-concat');
var rename 		= require('gulp-rename');
var uglify 		= require('gulp-uglify');
var sourcemaps 	= require('gulp-sourcemaps');

//var jasmine     = require('gulp-jasmine');

gulp.task('SpecRunner.update', function(){
	console.log(bowerFiles({includeDev: true})); 
	var target  = './test/SpecRunner.html',
        names =
            bowerFiles({includeDev: true})
            .concat([
                './src/**/*.js',
                './dist/**/*.js',
                './test/**/*Spec.js'
            ]),

		dependencies   = gulp.src(names, {read: false});
	
	return gulp.src(target)
        .pipe(inject(dependencies, {relative : true}))
		.pipe(gulp.dest('./test'));
});


gulp.task('package', function(){
    return gulp.src(['./src/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('march.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('march.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

//gulp.task('default', ['js-fef'], function(){});


gulp.task('default', ['package']);


