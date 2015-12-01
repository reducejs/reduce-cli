var test = require('tape')
var fs = require('fs')
var reduce = require('../lib/main')
var del = require('del')
var cp = require('child_process')
var postcss = require('reduce-css-postcss')

var path = require('path')
var fixtures = path.resolve.bind(path, __dirname)

var output = fixtures('build')
var src = fixtures('fixtures')
var jsf = fixtures(output, 'js', 'entry.js')
var cssf = fixtures(output, 'css', 'entry.css')
var jse = fixtures(src, 'js', 'entry-expect.js')
var csse = fixtures(src, 'css', 'entry-expect.css')

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
  r.run({
    css: {
      entry: '**/*.css',
      output: output,
      basedir: src,
      factor: {
        needFactor: true,
      },
      on: {
        instance: function (b) {
          b.plugin(postcss)
        },
      },
    }},
    function () {
      t.equal(
        fs.readFileSync(cssf, 'utf8'),
        fs.readFileSync(csse, 'utf8')
      )
      del(output)
    })
})

test('js only config', function (t) {
  t.plan(1)
  del(output)
  var r = new reduce('notexist.js')
  r.run({
    js: {
      entry: '**/*.js',
      output: output,
      basedir: src,
      factor: {
        needFactor: true,
      },
    }},
    function () {
      t.equal(
        fs.readFileSync(jsf, 'utf8'),
        fs.readFileSync(jse, 'utf8')
      )
      del(output)
    })
})

test('command line', function (t) {
  var pk = require('../package.json')
  t.plan(2)
  cp.exec('node ' + fixtures('..', 'bin', 'reduce-cli.js') + ' -v', {}, function(err, stdout) {
    t.false(err)
    t.equal(stdout, pk.version + '\n')
  })
})

