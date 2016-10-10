'use strict';
const gulp = require('gulp');
const pathNode = require('path');
const sequence = require('run-sequence');
const connect = require('gulp-connect');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const sprites = require('postcss-sprites').default;
const opt = {
	stylesheetPath: './build/css/',
	spritePath: './build/img/',
	spritesmith: {
		padding: 30
	},
	filterBy: function(image) {
		if (!/\.png$/.test(image.url)) {
			return Promise.reject();
		}
		return Promise.resolve();
	}

};
const preprocessors = [
	autoprefixer({browsers: ["last 1 version", "> 1%", "ie 10", "ie 9", "ie 8"]}),
	sprites(opt)
];

const path = {
	build: { //Build files
		html: 'build',
		css: 'build/css',
		img: 'build/img',
		js: 'build/js'
	},
	src: {
		html: 'src/index.html',
		scss: 'src/scss/main.scss',
		img: 'src/img/*.*',
		js: 'node_modules/html5shiv/dist/html5shiv.min.js'
	}
}

const watch = {
	html: 'src/index.html',
	scss: 'src/scss/**/*.scss',
	img: ['src/img/*', 'src/img/**/*'],
	js: 'src/js/*'
}

const bases = {
	app: 'src/',
	dist: 'build/'
};

gulp.task('clean', function() {
	return gulp.src(bases.dist)
		.pipe(clean());
});

gulp.task('connect', () => {
	connect.server({
		root: 'build',
		port: 1488,
		livereload: true
	});
});

gulp.task('connect-stop', () => {
	connect.serverClose();
});

gulp.task('copy-html', () => {
	return gulp
		.src([path.src.html])
		.pipe(gulp.dest(path.build.html))
		.pipe(connect.reload());
})

gulp.task('scss', () => {
	return gulp.src([path.src.scss])
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(postcss(preprocessors))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(path.build.css));
});

gulp.task('copy-html', () => {
	return gulp
		.src([path.src.html])
		.pipe(gulp.dest(path.build.html))
		.pipe(connect.reload());
})

gulp.task('copy-js', () => {
	return gulp
		.src([path.src.js])
		.pipe(gulp.dest(path.build.js))
})

gulp.task('copy-img', () => {
	return gulp
		.src([path.src.img])
		.pipe(gulp.dest(path.build.img));
})

gulp.task('watch', () => {
	gulp.watch([watch.html, watch.img, watch.scss, watch.js], ['reload-all']);
});

gulp.task('reload-all', () => {
	sequence(
		'clean',
		['copy-img','copy-js'],
		['scss'],
		['copy-html']
	);
});

gulp.task('default', () => {
	sequence(
		'clean',
		['copy-img', 'copy-js'],
		['scss', 'connect'],
		['copy-html'],
		'watch'
	);
});
