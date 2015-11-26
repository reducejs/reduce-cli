var postcss = require('reduce-css-postcss');
var path = require('path')

var fixtures = path.resolve.bind(path, __dirname);

function customTransform() {
}

module.exports = {
  watch: {

  },
  css: {
    transforms: [
         //[customTransform, args1, args2],
         //[anothercustomTransform, args1, args2],
    ],
    entry: "**/*.css",
    output: [
         fixtures('build'),
         null,
         //Doc: https://github.com/zoubin/postcss-custom-url#util
         {
           maxSize: 0,
           useHash: false,
           assetOutFolder: fixtures('build/assets/i')
         }
    ],
    basedir: fixtures('src'),
    //Doc: https://github.com/zoubin/factor-vinylify#options
    factor: {
      needFactor: true,
      common: 'common.css',
      //threshold: 1,
    },
    //Doc: https://github.com/zoubin/reduce-css#api
    reduce: {
    },
    on: {
      log: console.log.bind(console),
      error: function (err) {
        console.log(err);
      },
      instance: function (b) {
        b.plugin(postcss);
        //b.plugin(postcss, {
          //processorFilter: [require('postcss-calc')],
        //});
      },
    },
  },
  js: {
    transforms: [],
    entry: '**/*.js',
    output: fixtures('build'),
    basedir: fixtures('src'),
    //Doc: https://github.com/zoubin/factor-vinylify#options
    factor: {
      needFactor: true,
      common: 'common.js',
      //threshold: ['**/common.js'],
    },
    //Doc: https://github.com/zoubin/reduce-js#api
    reduce: {
    },
    on: {
      log: console.log.bind(console),
      error: function (err) {
        console.log(err);
      },
      instance: function (b) {
      },
    },
  },
};
