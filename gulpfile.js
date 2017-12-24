'use strict'

const fs = require('fs')
const gulp = require('gulp')
const browserify = require('browserify')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const source = require('vinyl-source-stream')
const postcss = require('gulp-postcss')
const babelify = require('babelify')

const destFolder = 'dist'

gulp.task('js', function() {
  browserify('./client/js/prepare.js')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(`${destFolder}/js`))

  browserify('./client/js/chat.js')
    .transform(babelify)
    .bundle()
    .pipe(source('chat.js'))
    .pipe(gulp.dest(`${destFolder}/js`))
})

gulp.task('css', function() {
  gulp.src([
    './node_modules/font-awesome/css/font-awesome.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './client/css/*.css',
  ])
  .pipe(postcss([
    require('autoprefixer'),
    require('postcss-nested'),
  ]))
  .pipe(concat('style.css'))
  .pipe(gulp.dest(`${destFolder}/css/`))
})

gulp.task('static', function() {
  gulp.src([
    './node_modules/bootstrap/dist/fonts/*',
    './node_modules/font-awesome/fonts/*',
  ])
  .pipe(rename({dirname: ''}))
  .pipe(gulp.dest(`${destFolder}/fonts`))

  // images
  gulp.src('./client/img/*')
  .pipe(gulp.dest(`${destFolder}/img`))
})

gulp.task('watch', function() {
  gulp.start('build')
  gulp.watch('./client/**/*', ['build'])
})

gulp.task('build', ['css', 'js', 'static'])
gulp.task('default', ['watch'])
