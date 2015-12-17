var reduce = require('../..')

var bundler = reduce(require('./reduce.config'))

var del = require('del')
var path = require('path')
var build = path.join(__dirname, 'build')

del(build).then(function () {
  bundler.watch()
})

