var gulp        = require('gulp');
var bowerFiles	= require('main-bower-files');
var inject 		= require("gulp-inject");

//var jasmine     = require('gulp-jasmine');

gulp.task('SpecRunner.update', function(){
	console.log(bowerFiles({includeDev: true})); 
	var target  = './test/SpecRunner.html',
        names =
            bowerFiles({includeDev: true})
            .concat([
                './src/**/*.js',
                './test/**/*Spec.js'
            ]),

		dependencies   = gulp.src(names, {read: false});
	
	return gulp.src(target)
        .pipe(inject(dependencies, {relative : true}))
		.pipe(gulp.dest('./test'));
});

//gulp.task('test', function () {
//    return gulp.src('./test/spec/**/*.js')
//        .pipe(jasmine());
//});


gulp.task("default", ["SpecRunner.update"]);