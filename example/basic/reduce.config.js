var postcss = require('reduce-css-postcss')
var path = require('path')

var fixtures = path.resolve.bind(path, __dirname)

module.exports = {
  css: {
    entry: '**/*.css',
    output: {
      dir: fixtures('build'),
    },
    basedir: fixtures('src'),
    //Doc: https://github.com/zoubin/factor-vinylify#options
    factor: {
      needFactor: true,
      common: 'common.css',
    },
    on: {
      log: console.log.bind(console),
      error: function (err) {
        console.log(err)
      },
      instance: function (b) {
        b.plugin(postcss)
      },
    },
  },
  js: {
    entry: '**/*.js',
    output: {
      dir: fixtures('build'),
    },
    basedir: fixtures('src'),
    //Doc: https://github.com/zoubin/factor-vinylify#options
    factor: {
      needFactor: true,
      common: 'common.js',
    },
    on: {
      log: console.log.bind(console),
      error: function (err) {
        console.log(err)
      },
    },
  },
}
