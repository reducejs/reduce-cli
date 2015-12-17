var reduce = require('../..')
var gulp = require('gulp')
var del = require('del')
var path = require('path')
var build = path.join(__dirname, 'build')

var bundler = reduce(require('./reduce.config'))

gulp.task('clean', function () {
  return del(build)
})

gulp.task('build', ['clean'], bundler)
gulp.task('watch', ['clean'], bundler.watch)

