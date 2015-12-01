var postcss = require('reduce-css-postcss');
var path = require('path')

var fixtures = path.resolve.bind(path, __dirname);

module.exports = {
  css: {
    entry: "**/*.css",
    basedir: fixtures('src'),
    output: [
         fixtures('build'),
         null,
         //Doc: https://github.com/zoubin/postcss-custom-url#util
         {
           maxSize: 0,
           useHash: true,
           assetOutFolder: fixtures('build/assets/i')
         }
    ],
    //Doc: https://github.com/zoubin/factor-vinylify#options
    factor: {
      needFactor: true,
      common: 'common.css',
    },
    on: {
      log: console.log.bind(console),
      error: function (err) {
        console.log(err);
      },
      instance: function (b) {
        b.plugin(postcss);
      },
    },
  },
};
