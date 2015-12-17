var mix = require('mixy')
var reduce = require('reduce-css')
var postcss = require('reduce-css-postcss')
var createBundler = require('./createBundler')
var buildThreshold = require('./buildThreshold')

module.exports = function (opts, watchOpts) {
  return createBundler(reduce, normalize(opts), watchOpts)
}

// `opts` is options for `createBundler`
function normalize(opts) {
  // `opts.reduce` is options for `reduce-css`
  var bundleOpts = opts.reduce

  bundleOpts.atRuleName = opts.atRuleName || 'external'
  bundleOpts.basedir = opts.basedir

  var factor = opts.factor || {}
  if (typeof factor === 'string') {
    factor = { common: factor }
  }
  bundleOpts.factor = mix({
    needFactor: true,
    common: 'common.css',
  }, factor)
  if (!factor.threshold) {
    opts.threshold = opts.threshold == null ? 10000 : opts.threshold
    buildThreshold(bundleOpts, opts)
  }

  if (!opts.resolve) {
    opts.resolve = {
      main: 'style',
      extensions: ['.css'],
      symlink: true,
    }
    if (opts.paths) {
      opts.resolve.paths = [].concat(opts.paths)
    }
  }
  bundleOpts.resolve = opts.resolve

  var postcssOpts = opts.postcss || {}
  var processorFilter = postcssOpts.processorFilter
  postcssOpts.processorFilter = function (pipeline) {
    // Specify options passed to `postcss-simple-import`
    // Refer to `https://github.com/zoubin/postcss-simple-import` for more information.
    pipeline.get('postcss-simple-import').push({ resolve: bundleOpts.resolve })

    if (processorFilter) {
      return processorFilter(pipeline)
    }
  }

  bundleOpts.plugin = [].concat(opts.plugin).filter(Boolean)
  bundleOpts.plugin.push([postcss, postcssOpts])

  return opts
}

