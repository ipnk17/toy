var syntax        = 'scss'; // Syntax: sass or scss;

var gulp          = require('gulp'),
	gutil         = require('gulp-util' ),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require("gulp-notify"),
	rsync         = require('gulp-rsync'),
	del = require('del'),
	cache = require('gulp-cache'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "adamant", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 2: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.js',
		'app/js/coockie.js',
		'app/js/jquery-ui.js',
		'app/libs/bootstrap/js/popper/popper.min.js',
		'app/libs/bootstrap/js/bootstrap.min.js',
		// 'app/js/wow.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});
gulp.task('clean', function() {
	return del.sync('dist');
});
gulp.task('clear', function() {
	return cache.clearAll();
});
gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache( imagemin({
		interlaced: true,
		progressive: true,
		svgoPlagins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['styles', 'js', 'browser-sync'], function() {
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload)
});
gulp.task('build', ['clean','styles','js','img'], function() {
	var builCss = gulp.src('app/css/main.min.css')
	.pipe(gulp.dest('dist/css'));
	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));
	var buildJs = gulp.src('app/js/scripts.min.js').pipe(uglify())
	.pipe(gulp.dest('dist/js'));
	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'))
})

gulp.task('default', ['watch']);
