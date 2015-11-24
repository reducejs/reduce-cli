import test from 'tape'
import fs from 'fs'
import reduce from '../lib/main'
import del from 'del'
import cli from '../lib/cli'

var output = 'test/build'
var src = 'test/fixtures'
var jsf = output + '/js/entry.js'
var cssf = output + '/css/entry.css'

test('empty config', function (t) {
  t.plan(1)
  var r = new reduce('notexist.js')
  r.run({}, function () {
    fs.stat(output, function(err, stats) {
      t.false(!err && stats.isDirectory())
    })
  })
})

test('css only config', function (t) {
  t.plan(1)
  var r = new reduce('notexist.js')
  r.run({css: {entry: '**/*.css', output: output, deps: {basedir: src, factor: {needFactor: true}}}}, function () {
    fs.stat(cssf, function(err, stats) {
      t.true(!err && stats.isFile())
      del(output)
    })
  })
})

test('js only config', function (t) {
  t.plan(1)
  var r = new reduce('notexist.js')
  r.run({js: {entry: '**/*.js', output: output, deps: {basedir: src, factor: {needFactor: true}}}}, function () {
    fs.stat(jsf, function(err, stats) {
      t.true(!err && stats.isFile())
      del(output)
    })
  })
})

test('command line', function (t) {
  t.plan(3)
  var args

  args = {help: true}
  cli(args)
  fs.stat(output, function(err, stats) {
    t.false(!err && stats.isDirectory())
  })

  args = {version: true}
  cli(args)
  fs.stat(output, function(err, stats) {
    t.false(!err && stats.isDirectory())
  })

  args = {config: 'notexist.js'}
  cli(args)
  fs.stat(output, function(err, stats) {
    t.false(!err && stats.isDirectory())
  })
})

