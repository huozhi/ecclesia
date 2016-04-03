'use strict'

const fs = require('fs')
const gulp = require('gulp')
const mainBowerFiles = require('main-bower-files')
const browserify = require('browserify')
const filter = require('gulp-filter')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const source = require('vinyl-source-stream')
const less = require('gulp-less')
const sass = require('gulp-sass')
const streamQueue = require('streamqueue')
const bowerPath = 'src/bower_components'
const destFolder = 'public'



gulp.task('rtc', function() {
  const srcRoot = './src/rtc'
  return browserify(`${srcRoot}/simplewebrtc.js`)
  .bundle({standalone: 'SimpleWebRTC'})
  .pipe(source('rtc.js'))
  .pipe(gulp.dest(`${destFolder}/js`))
})

gulp.task('js', function() {
  // bower bundle
  gulp.src(mainBowerFiles('*/**.js', {
    path: bowerPath
  }))
  // .pipe(filter(['**/*.js']))
  .pipe(concat('app.js'))
  .pipe(gulp.dest(`${destFolder}/js`))

  gulp.src('./src/js/**/*.js')
  .pipe(filter(['**/*.js']))
  .pipe(gulp.dest(`${destFolder}/js`))

})

gulp.task('css', function() {
  // .concat(['src/css/app.css'])
  let lessStream, cssStream

  lessStream = gulp.src(mainBowerFiles('**/*.less', {
    path: bowerPath
  }))
  .pipe(less())

  cssStream = gulp.src('src/css/*.css')

  streamQueue({ objectMode: true },
    lessStream,
    cssStream
  )
  .pipe(concat('style.css'))
  .pipe(gulp.dest(`${destFolder}/css/`))

  gulp.src(['src/css/**/*.css', '!src/css/app.css'])
  .pipe(gulp.dest(`${destFolder}/css/`))
})

gulp.task('static', function() {
  // fonts
  gulp.src([
    `${bowerPath}/bootstrap-sass/**/fonts/*`,
    `${bowerPath}/font-awesome/fonts/*`,
  ])
  .pipe(filter([
    '**/*.eot', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.tt'
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

gulp.task('test', function() {
  console.log(mainBowerFiles('**/*.less', {
    path: bowerPath
  }))
})

gulp.task('base', ['css', 'js', 'static'])
gulp.task('build', ['rtc', 'css', 'js', 'static'])
gulp.task('default', ['build'])
