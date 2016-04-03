'use strict'

const fs = require('fs')
const gulp = require('gulp')
const mainBowerFiles = require('main-bower-files')
const browserify = require('browserify')
const filter = require('gulp-filter')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const source = require('vinyl-source-stream')

const bowerPath = 'src/bower_components'
const destFolder = 'public'

const mainBowerInstance = mainBowerFiles({
  path: bowerPath
  // {
  //   bowerDirectory: bowerPath,
  //   bowerrc: '.bowerrc',
  //   bowerJson: 'bower.json',
  // }
})

gulp.task('rtc', function() {
  const srcRoot = './src/rtc'
  return browserify(`${srcRoot}/simplewebrtc.js`)
  .bundle({standalone: 'SimpleWebRTC'})
  .pipe(source('rtc.js'))
  .pipe(gulp.dest(`${destFolder}/js`))
})

gulp.task('js', function() {
  // bower bundle
  gulp.src(mainBowerInstance)
  .pipe(filter(['**/*.js']))
  .pipe(concat('app.js'))
  .pipe(gulp.dest(`${destFolder}/js`))

  gulp.src('./src/js/**/*.js')
  .pipe(filter(['**/*.js']))
  .pipe(gulp.dest(`${destFolder}/js`))

})

gulp.task('css', function() {
  gulp.src(mainBowerInstance.concat(['src/css/app.css']))
  .pipe(filter(['**/*.css']))
  .pipe(concat('style.css'))
  .pipe(gulp.dest(`${destFolder}/css/`))

  gulp.src(['src/css/**/*.css', '!src/css/app.css'])
  .pipe(gulp.dest(`${destFolder}/css/`))
})

gulp.task('static', function() {
  // fonts
  const bootstrapPath = `${bowerPath}/bootstrap/dist/fonts/*`
  gulp.src(bootstrapPath)
  .pipe(filter([
    '*.eot', '*.woff', '*.woff2', '*.svg','*.tt'
  ]))
  .pipe(gulp.dest(`${destFolder}/fonts/`))

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
