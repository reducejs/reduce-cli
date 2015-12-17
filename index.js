var createJsBundler = require('./lib/js-bundler')
var createCssBundler = require('./lib/css-bundler')
var mix = require('mixy')

module.exports = function (opts) {
  opts = opts || {}

  var jsBundler = opts.js
    ? createJsBundler(normalize(opts.js, opts), opts.watch)
    : noopBundler()

  var cssBundler = opts.css
    ? createCssBundler(normalize(opts.css, opts), opts.watch)
    : noopBundler()

  function bundler() {
    return Promise.all([jsBundler(), cssBundler()])
  }

  function watch(cb) {
    jsBundler.watch(cb)
    cssBundler.watch(cb)
  }

  bundler.watch = watch

  return bundler
}

// `extra` is common options for `js` and `css`
function normalize(opts, extra) {
  opts = opts || {}

  opts.on = mix({}, opts.on, extra.on)

  if (!opts.basedir) {
    opts.basedir = extra.basedir
  }

  if (!opts.paths) {
    opts.paths = extra.paths
  }

  opts.reduce = opts.reduce || {}

  return opts
}

function noopBundler() {
  var noop = function () {
    return Promise.resolve()
  }
  noop.watch = noop
  return noop
}

