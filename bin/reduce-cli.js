#!/usr/bin/env node

var path = require('path')
var reduce = require('..')

var program = require('commander')
program
  .version(require('../package.json').version)
  .option('-c, --config <filename>', 'Specify the config file. The default config file is reduce.config.js', 'reduce.config.js')
  .option('-w, --watch', 'Bundle and start watching for changes. With watch options in the config file')
  .parse(process.argv)

Promise.resolve()
  .then(function () {
    return require(path.resolve(program.config))
  })
  .then(function (conf) {
    var bundler = reduce(conf)
    if (program.watch) {
      return bundler.watch()
    }
    return bundler().then(function () {
      console.log('DONE!')
    })
  })
