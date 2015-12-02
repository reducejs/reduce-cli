#!/usr/bin/env node

var reduce = require('../lib/main')
var version = require('../package.json').version
var program = require('commander')

program
  .version(version)
  .option('-c, --config <filename>', 'Specify the config file. The default config file is reduce.config.js')
  .option('-w, --watch', 'Bundle and start watching for changes. With watch options in the config file')
  .parse(process.argv)

if (program.watch) {
  reduce.watch(program.config)
} else {
  reduce(program.config).catch(function(e) {
    console.error(e.message)
  })
}
