var test = require('tape')
var fs = require('fs')
var reduce = require('../lib/main')
var del = require('del')
var cp = require('child_process')

var path = require('path')
var fixtures = path.resolve.bind(path, __dirname)

var output = fixtures('build')
var src = fixtures('fixtures')
var jsf = fixtures(output, 'js', 'entry.js')
var cssf = fixtures(output, 'css', 'entry.css')

test('empty config', function (t) {
  t.plan(1)
  del(output)
  var r = new reduce('notexist.js')
  r.run({}, function () {
    fs.stat(output, function(err, stats) {
      t.false(!err && stats.isDirectory())
    })
  })
})

test('css only config', function (t) {
  t.plan(1)
  del(output)
  var r = new reduce('notexist.js')
  r.run({css: {entry: '**/*.css', output: output, basedir: src, factor: {needFactor: true}}}, function () {
    fs.stat(cssf, function(err, stats) {
      t.true(!err && stats.isFile())
      del(output)
    })
  })
})

test('js only config', function (t) {
  t.plan(1)
  del(output)
  var r = new reduce('notexist.js')
  r.run({js: {entry: '**/*.js', output: output, basedir: src, factor: {needFactor: true}}}, function () {
    fs.stat(jsf, function(err, stats) {
      t.true(!err && stats.isFile())
      del(output)
    })
  })
})

test('command line', function (t) {
  var pk = require('../package.json')
  t.plan(2)
  cp.exec('./bin/reduce-cli.js -v', {}, function(err, stdout, stderr) {
    t.false(err)
    t.equal(stdout, pk.version + '\n')
  })
})

