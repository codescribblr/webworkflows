var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHMTL = require('gulp-minify-html'),
	imagemin = require('gulp-imagemin'),
	pngcrush = require('imagemin-pngcrush'),
	concat = require('gulp-concat');

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
sassSources = [
	'components/sass/style.scss'
];
htmlSources = [
	outputDir + '*.html'
];

gulp.task('coffee', function(){
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + 'images',
			style: sassStyle,
			comments: true
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('json', function(){
	gulp.src('builds/development/js/*.json')
		.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'js')))
		.pipe(connect.reload())
});

gulp.task('images', function(){
	gulp.src('builds/development/images/**/*.*')
		.pipe(gulpif(env === 'production', imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngcrush()]
		})))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
		.pipe(connect.reload())
});


gulp.task('html', function(){
	gulp.src('builds/development/*.html')
		.pipe(gulpif(env === 'production', minifyHMTL()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
		.pipe(connect.reload())
});

gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('builds/development/images/**/*.*', ['images']);
	gulp.watch('builds/development/*.json', ['json']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'html', 'json', 'images', 'watch']);