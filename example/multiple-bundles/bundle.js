var reduce = require('../..')
var del = require('del')
var path = require('path')
var build = path.join(__dirname, 'build')

var bundler = reduce(require('./reduce.config'))
del(build).then(bundler).then(function () {
  console.log('DONE')
})
