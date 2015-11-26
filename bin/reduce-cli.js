#!/usr/bin/env node

var reduce = require('../lib/main')
var program = require('commander')

program
  .option('-v, --vers', 'Show the current version')
  .option('-c, --config <filename>', 'Specify the config file. The default config file is reduce.config.js')
  .option('-w, --watch', 'Bundle and start watching for changes. With watch options in the config file')
  .parse(process.argv)

if (program.vers) {
  console.log(require('../package.json').version)
  process.exit()
}

var r = new reduce(program.config)

if (!r.cfg.css && !r.cfg.js) {
  console.log("please check 'reduce.config.js' file.")
  process.exit(1)
}

if (program.watch) {
  r.watch()
} else {
  r.run()
}
