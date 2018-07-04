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
  browserify('./client/js/index.js')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(`${destFolder}/js`))
})

gulp.task('css', function() {
  gulp.src([
    './client/css/index.css',
  ])
  .pipe(postcss([
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-nested'),
  ]))
  .pipe(concat('style.css'))
  .pipe(gulp.dest(`${destFolder}/css/`))
})

gulp.task('static', function() {
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
