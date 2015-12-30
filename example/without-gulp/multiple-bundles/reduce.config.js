var path = require('path')
var build = path.join(__dirname, 'build')

module.exports = {
  on: {
    error: function (err) {
      console.log(err.stack)
    },
    log: console.log.bind(console),
  },

  basedir: path.join(__dirname, 'src'),

  // Now, we can `require('lib/world')` anywhere under the `src` directory.
  // Otherwise, we have to write relative paths like `require('../../web_modules/lib/world')`
  paths: [path.join(__dirname, 'src', 'web_modules')],

  js: {
    entries: 'page/**/index.js',

    on: {
      instance: function (b) {
        // Add extra modules,
        // which are not in the dependency graph.
        b.add('node_modules/lazyload/index.js')
      },
    },

    // Options for `reduce-js`
    // reduce: {},

    bundleOptions: {
      groups: '**/page/**/index.js',
      common: 'common.js',
    },

    /*
    basedir: '',
    paths: [],
    */

    dest: build,
  },
  css: {
    entries: 'page/**/index.css',

    // Options for `reduce-css`
    // reduce: {},

    bundleOptions: {
      groups: '**/page/**/index.css',
      common: 'common.css',
    },

    /*
    basedir: '',
    paths: [],
    atRuleName: 'external',
    */

    dest: [
      build,
      null,
      {
        // Assets with size less than `maxSize` will be inlined.
        maxSize: 0,

        // If `true`, all non-inline assets will be renamed with their sha1 when copied.
        // useHash: true,
        // Specify how to rename (basename without the extension) assets when copied.
        name: '[name].[hash]',

        // Where non-inline assets will be copied.
        assetOutFolder: path.join(build, 'images'),
      },
    ],
  },
}
