# reduce-cli
CLI for [`reduce-css`] and [`reduce-js`].

CSS modules are preprocessed by [`reduce-css-postcss`] before packing into bundles.

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
var bundler = reduce(require('./reduce.config'))

bundler().then(function () {
  // DONE
})

// To watch
bundler.watch()

```

Check the [examples](example/) to see how to config.

### Gulp
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

## Example

**Input**

Directory structures:
```
example/multiple-bundles/src/
├── node_modules
│   ├── exclamation
│   │   ├── excl.js
│   │   └── package.json
│   ├── lazyload
│   │   └── index.js
│   └── reset
│       └── index.css
├── page
│   ├── hello
│   │   ├── index.css
│   │   └── index.js
│   └── hi
│       ├── index.css
│       └── index.js
└── web_modules
    ├── component
    │   └── button
    │       ├── button.png
    │       └── index.css
    ├── helper
    │   └── color
    │       └── index.css
    └── lib
        └── world.js

```

page/hello/index.css:
```css
@external "reset";
@external "component/button";
@import "helper/color";
.hello {
  color: $blue;
}

```
page/hello/index.js:
```javascript
var world = require('lib/world')
module.exports = 'hello, ' + world

```

page/hi/index.css:
```css
@external "reset";
@external "component/button";
@import "helper/color";
.hi {
  color: $red;
}

/* overwrite the default button style */
.button {
  background-color: $green;
}

```
page/hi/index.js:
```javascript
var world = require('lib/world')
module.exports = 'hi, ' + world

```

web_modules/component/button/index.css:
```css
@import "helper/color";
.button {
  background-color: $green;
  background-image: url(button.png);
}

```

web_modules/helper/color/index.css:
```css
$red: #FF0000;
$green: #00FF00;
$blue: #0000FF;

```

web_modules/lib/world.js:
```javascript
module.exports = 'world' + require('exclamation')

```

**reduce.config.js**

```javascript
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

    bundleOptions: {
      groups: '**/page/**/index.js',
      common: 'common.js',
    },

    dest: build,
  },

  css: {
    entries: 'page/**/index.css',

    bundleOptions: {
      groups: '**/page/**/index.css',
      common: 'common.css',
    },

    dest: [
      build,
      null,
      {
        maxSize: 0,
        name: '[name].[hash]',
        assetOutFolder: path.join(build, 'images'),
      },
    ],
  },
}

```

**Output**

Directory structures:

```
example/multiple-bundles/build/
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

page/hello/index.css:

```css
.hello {
  color: #0000FF;
}

```

page/hello/hi.js:

```javascript
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({3:[function(require,module,exports){
var world = require('lib/world')
module.exports = 'hello, ' + world


},{"lib/world":5}]},{},[3]);

```

page/hi/index.css:

```css
.hi {
  color: #FF0000;
}

/* overwrite the default button style */
.button {
  background-color: #00FF00;
}

```

page/hi/index.js:

```javascript
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({4:[function(require,module,exports){
var world = require('lib/world')
module.exports = 'hi, ' + world


},{"lib/world":5}]},{},[4]);

```

common.css:

```css
html, body {
  margin: 0;
  padding: 0;
}

.button {
  background-color: #00FF00;
  background-image: url(images/button.161fff2.png);
}

```

common.js:

```javascript
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({5:[function(require,module,exports){
module.exports = 'world' + require('exclamation')

},{"exclamation":1}],2:[function(require,module,exports){
module.exports = function () {
  console.log('Lazyload initialized')
}

},{}],1:[function(require,module,exports){
module.exports = '!'


},{}]},{},[2]);

```

**HTML**

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

## Options

### basedir
This is the `basedir` option of [`reduce-js`] and [`reduce-css`].
It is used to get absolute file paths.

Type: `String`

### paths
Specify a group of directories where to look for modules.

Type: `Array`

If you set this options to `['/path/to/web_modules']`,
and there is a module `/path/to/web_modules/some_mod`,
then you can `require('some_mod')`,
or `@external "some_mod";`,
or `@import "some_mod";`.
That will save you a lot of letters to write something like
`require('../../../web_modules/some_mod')`.

### on
Specify event listeners for both [`reduce-js`] and [`reduce-css`].

Usually for handling `error` and `log` events.

Type: `Object`

### js
Specify options for bundling javascript.

* `js.entries`: [`globby`] patterns to locate modules to start.
* `js.dest`: arguments for [`reduce-js#dest`].
* `js.on`: passed to [`reduce-js`] as its `on` option.
* `js.bundleOptions`: passed to [`reduce-js`] as its `bundleOptions` option.
* `js.reduce`: passed to [`reduce-js`] as the options object.

### css
Specify options for bundling css.

* `css.entries`: [`globby`] patterns to locate modules to start.
* `css.dest`: arguments for [`reduce-css#dest`].
* `css.on`: passed to [`reduce-css`] as its `on` option.
* `css.bundleOptions`: passed to [`reduce-css`] as its `bundleOptions` option.
* `css.reduce`: passed to [`reduce-css`] as the options object.


[`reduce-css`]: https://github.com/zoubin/reduce-css
[`reduce-css-postcss`]: https://github.com/zoubin/reduce-css-postcss
[`reduce-js`]: https://github.com/zoubin/reduce-js.
[`gulp`]: https://github.com/gulpjs/gulp
[`globby`]: https://github.com/sindresorhus/globby
[`reduce-js#dest`]: https://github.com/zoubin/reduce-js#reducedest
[`reduce-css#dest`]: https://github.com/zoubin/reduce-css#reducedestoutfolder-opts-urlopts
