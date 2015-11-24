#!/usr/bin/env node

var cli = require('../lib/cli')
var args = process.argv.slice(2)
var argv = require('subarg')(args, {
  alias: {
    h: 'help',
    v: 'version',
    s: 'server',
    c: 'config',
    w: 'watch',
  },
})

cli(argv)
