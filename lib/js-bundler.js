var mix = require('mixy')
var reduce = require('reduce-js')
var createBundler = require('./createBundler')
var buildThreshold = require('./buildThreshold')

module.exports = function (opts, watchOpts) {
  return createBundler(reduce, normalize(opts), watchOpts)
}

// `opts` is options for `createBundler`
function normalize(opts) {
  // `opts.reduce` is options for `reduce-js`
  var bundleOpts = opts.reduce

  bundleOpts.basedir = opts.basedir
  bundleOpts.paths = opts.paths

  var factor = opts.factor || {}
  if (typeof factor === 'string') {
    factor = { common: factor }
  }
  bundleOpts.factor = mix({
    needFactor: true,
    common: 'common.js',
  }, factor)
  if (!factor.threshold) {
    buildThreshold(bundleOpts, opts)
  }

  return opts
}

