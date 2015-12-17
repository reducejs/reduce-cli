var path = require('path')
var build = path.join(__dirname, 'build')

module.exports = {
  on: {
    error: function (err) {
      console.log(err.stack)
    },
    log: console.log.bind(console),

    // In watch mode, each time bundles created a `done` event is emitted.
    done: function () {
      console.log('New bundles created!')
    },
  },

  basedir: path.join(__dirname, 'src'),

  // Now, we can `require('lib/world')` anywhere under the `src` directory.
  // Otherwise, we have to write relative paths like `require('../../web_modules/lib/world')`
  paths: [path.join(__dirname, 'src', 'web_modules')],

  css: {
    entries: 'page/**/index.css',

    // Options for `reduce-css`
    // reduce: {},

    factor: {
      // One bundle for each entry detected from `.src()`.
      // If `false`, all styles go to the same bundle.
      needFactor: false,

      // Name of the common bundle
      // If `false`, no common bundle will be generated,
      // unless `needFactor` is `false`,
      // in which case `common.css` is used.
      common: 'bundle.css',
    },
    /*
    basedir: '',

    // additional directories to look up modules
    paths: [],

    // Use `@external "dependency";` to declare a external module,
    // which should be loaded before the current.
    atRuleName: 'external',
    */

    // Styles automatically added and packed into the common bundle.
    bootstrap: ['node_modules/reset/index.css'],

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

  js: {
    entries: 'page/**/index.js',

    // Options for `reduce-js`
    // reduce: {},

    factor: {
      // One bundle for each entry detected from `.src()`.
      // If `false`, all scripts go to the same bundle.
      needFactor: false,

      // Name of the common bundle
      // If `false`, no common bundle will be generated,
      // unless `needFactor` is `false`,
      // in which case `common.css` is used.
      common: 'bundle.js',
    },
    /*
    basedir: '',

    // additional directories to look up modules
    paths: [],
    */

    // Scripts automatically added and packed into the common bundle.
    bootstrap: ['node_modules/lazyload/index.js'],

    // threshold: 1,
    // commonModules: [],

    dest: build,
  },
}
