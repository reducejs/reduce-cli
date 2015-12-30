var reduce = require('reduce-css')
var postcss = require('reduce-css-postcss')
var createBundler = require('./createBundler')

module.exports = function (opts, watchOpts) {
  return createBundler(reduce, normalize(opts), watchOpts)
}

// `opts` is options for `createBundler`
function normalize(opts) {
  // `opts.reduce` is options for `reduce-css`
  var options = opts.reduce

  options.atRuleName = opts.atRuleName || 'external'
  options.basedir = opts.basedir
  options.bundleOptions = opts.bundleOptions

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
  options.resolve = opts.resolve

  var postcssOpts = opts.postcss || {}
  var processorFilter = postcssOpts.processorFilter
  postcssOpts.processorFilter = function (pipeline) {
    // Specify options passed to `postcss-simple-import`
    // Refer to `https://github.com/zoubin/postcss-simple-import` for more information.
    pipeline.get('postcss-simple-import').push({ resolve: options.resolve })

    if (processorFilter) {
      return processorFilter(pipeline)
    }
  }

  options.plugin = [].concat(opts.plugin).filter(Boolean)
  options.plugin.push([postcss, postcssOpts])

  return opts
}

