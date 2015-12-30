var reduce = require('reduce-js')
var createBundler = require('./createBundler')

module.exports = function (opts, watchOpts) {
  return createBundler(reduce, normalize(opts), watchOpts)
}

// `opts` is options for `createBundler`
function normalize(opts) {
  // `opts.reduce` is options for `reduce-js`
  var options = opts.reduce

  options.basedir = opts.basedir
  options.paths = opts.paths
  options.bundleOptions = opts.bundleOptions

  return opts
}

