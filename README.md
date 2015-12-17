# reduce-cli
CLI for [reduce-css](https://github.com/zoubin/reduce-css) and [reduce-js](https://github.com/zoubin/reduce-js).

## Install

`npm install -g reduce-cli` to run `reduce` in the command line.

`npm install --save-dev reduce-cli` to use the api.

## Usage

### Command line

```bash
reduce -h

```

By default, `reduce` will use `reduce.config.js` in the current working directory as the config file.

### API

```javascript
var reduce = require('reduce-cli')
var bundler = reduce(config)

bundler().then(function () {
  // DONE
})

// To watch
bundler.watch()

```

Check the [examples](example/) to see how to config.

## Example

### Multiple bundles with a common bundle

`reduce.config.js`:

```javascript
var path = require('path')
var build = path.join(__dirname, 'build')

module.exports = {
  on: {
    error: function (err) {
      console.log(err.stack)
    },
    log: console.log.bind(console),
    done: function () {
      console.log('New bundles created!')
    },
  },

  basedir: path.join(__dirname, 'src'),

  // Now, we can `require('lib/world')` anywhere under the `src` directory.
  // Otherwise, we have to write relative paths like `require('../../web_modules/lib/world')`
  paths: [path.join(__dirname, 'src', 'web_modules')],

  js: {
    entries: 'page/**/index.js',

    // Options for `reduce-js`
    // reduce: {},

    /*
    factor: {
      // One bundle for each entry detected from `.src()`.
      // If `false`, all scripts go to the same bundle.
      needFactor: true,

      // Name of the common bundle
      // If `false`, no common bundle will be generated,
      // unless `needFactor` is `false`,
      // in which case `common.css` is used.
      common: 'common.js',
    },
    basedir: '',
    paths: [],
    */

    // Scripts automatically added and packed into the common bundle.
    // If no common bundle is created, they will be packed into all bundles.
    bootstrap: ['node_modules/lazyload/index.js'],

    // threshold: 1,
    // commonModules: [],

    dest: build,
  },
  css: {
    entries: 'page/**/index.css',

    // Options for `reduce-css`
    // reduce: {},

    /*
    factor: {
      // One bundle for each entry detected from `.src()`.
      // If `false`, all styles go to the same bundle.
      needFactor: true,

      // Name of the common bundle
      // If `false`, no common bundle will be generated,
      // unless `needFactor` is `false`,
      // in which case `common.css` is used.
      common: 'common.css',
    },
    basedir: '',
    paths: [],
    atRuleName: 'external',
    */

    // Styles automatically added and packed into the common bundle.
    // If no common bundle is created, they will be packed into all bundles.
    bootstrap: ['node_modules/reset/index.css'],

    // threshold: 10000,
    // Component styles should go to the common bundle.
    commonModules: ['**/component/**/*.css', '!**/node_modules/**/*.css'],

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

```

#### Directories

```
⌘ tree multiple-bundles
multiple-bundles
├── bundle.js
├── gulpfile.js
├── reduce.config.js
├── src
│   ├── node_modules
│   │   ├── exclamation
│   │   │   ├── excl.js
│   │   │   └── package.json
│   │   ├── lazyload
│   │   │   └── index.js
│   │   └── reset
│   │       └── index.css
│   ├── page
│   │   ├── hello
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   └── hi
│   │       ├── index.css
│   │       └── index.js
│   └── web_modules
│       ├── component
│       │   └── button
│       │       ├── button.png
│       │       └── index.css
│       ├── helper
│       │   └── color
│       │       └── index.css
│       └── lib
│           └── world.js
└── watch.js

```

##### web_modules
Put your local js and css modules in this directory,
then you can access them under `src` like:

```javascript
var world = require('lib/world')

```

```css
@external "component/button";
@import "helper/color";

```

##### Bundle and watch

`bundle.js`:

```javascript
var reduce = require('reduce-cli')
var del = require('del')
var path = require('path')
var build = path.join(__dirname, 'build')

var bundler = reduce(require('./reduce.config'))
del(build).then(bundler).then(function () {
  console.log('DONE')
})

```

`watch.js`:

```javascript
var reduce = require('reduce-cli')
var del = require('del')
var path = require('path')
var build = path.join(__dirname, 'build')

var bundler = reduce(require('./reduce.config'))
del(build).then(function () {
  bundler.watch()
})

```

To work with `gulp`, create tasks in the `gulpfile.js` like:

```javascript
var reduce = require('reduce-cli')
var gulp = require('gulp')
var del = require('del')
var path = require('path')
var build = path.join(__dirname, 'build')

var bundler = reduce(require('./reduce.config'))

gulp.task('clean', function () {
  return del(build)
})

gulp.task('build', ['clean'], bundler)
gulp.task('watch', ['clean'], bundler.watch)

```

**output**:

```
⌘ tree build/
build/
├── common.css
├── common.js
├── images
│   └── button.161fff2.png
└── page
    ├── hello
    │   ├── index.css
    │   └── index.js
    └── hi
        ├── index.css
        └── index.js

```

In page `hello.html`:

```html
<script src="common.js"></script>
<script src="hello.js"></script>

<link rel="stylesheet" type="text/css" href="common.css" />
<link rel="stylesheet" type="text/css" href="hello.css" />

```

In page `hi.html`:

```html
<script src="common.js"></script>
<script src="hi.js"></script>

<link rel="stylesheet" type="text/css" href="common.css" />
<link rel="stylesheet" type="text/css" href="hi.css" />

```

### Multiple bundles with no common bundle
Check the [example](example/multiple-bundles-without-common/).

### Single bundle
Check the [example](example/single-bundle/).

