'use strict'

const fs = require('fs')
const gulp = require('gulp')
const browserify = require('browserify')
const filter = require('gulp-filter')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const source = require('vinyl-source-stream')
const sass = require('gulp-sass')
const streamQueue = require('streamqueue')

const destFolder = 'static'

gulp.task('rtc', function() {
  return browserify(`./src/rtc/simplewebrtc.js`)
  .bundle({standalone: 'SimpleWebRTC'})
  .pipe(source('rtc.js'))
  .pipe(gulp.dest(`${destFolder}/js`))
})

gulp.task('js', function() {
  browserify('./src/js/prepare.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(`${destFolder}/js`))

  gulp.src([
    './src/js/**/*.js',
  ])
    .pipe(gulp.dest(`${destFolder}/js`))
})

gulp.task('css', function() {
  gulp.src([
    'src/css/*.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
  ])
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(require('gulp-clean-css')())
  .pipe(gulp.dest(`${destFolder}/css/`))
})

gulp.task('static', function() {
  gulp.src([
    './node_modules/bootstrap/**/fonts/*',
    './node_modules/font-awesome/fonts/*',
  ])
  .pipe(filter([
    '**/*.eot', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.tt'
  ]))
  .pipe(rename({dirname: ''}))
  .pipe(gulp.dest(`${destFolder}/fonts`))

  // favicon
  gulp.src('./src/favicon.ico')
  .pipe(gulp.dest(destFolder))

  // images
  gulp.src('./src/img/*')
  .pipe(gulp.dest(`${destFolder}/img`))
})

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['base'])
})

gulp.task('base', ['css', 'js', 'static'])
gulp.task('build', ['rtc', 'css', 'js', 'static'])
gulp.task('default', ['build'])
