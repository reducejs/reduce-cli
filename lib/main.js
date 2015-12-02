var path = require('path')
var fs = require('fs')
var reducecss = require('reduce-css')
var reducejs = require('reduce-js')
var parallel = require('callback-sequence').parallel
var mix = require('util-mix')
var promisify = require('node-promisify')

var promisifyStat = promisify(fs.stat)

function _load_config(config) {
  if (typeof config === 'object') {
    return Promise.resolve(config)
  }

  var cfgName = config || 'reduce.config.js'
  var cfgPath = path.resolve(process.cwd(), cfgName)

  return promisifyStat(cfgPath).then(function () {
    return require(cfgPath)
  })
}

function Reduce(config) {
  return _load_config(config).then(function (cfg) {
    var c = mix({}, this.cfg, cfg)
    var jobs = []

    var cssjob = function() {
      return bundle(c.css, reducecss)
      .pipe(getPipeline(c.css, reducecss)())
    }
    var jsjob = function() {
      return bundle(c.js, reducejs)
      .pipe(getPipeline(c.js, reducejs)())
    }

    if (c.css) {
      jobs.push(cssjob)
    }

    if (c.js) {
      jobs.push(jsjob)
    }

    return parallel(jobs)
  })
}

Reduce.watch = function(config) {
  return _load_config(config).then(function (cfg) {
    var c = mix({}, this.cfg, cfg)
    if (c.css) {
      bundle(c.css, reducecss.watch(c.css.watch || c.watch))
      .pipe(getPipeline(c.css, reducecss))
    }
    if (c.js) {
      bundle(c.js, reducejs.watch(c.js.watch || c.watch))
      .pipe(getPipeline(c.js, reducejs))
    }
  })
}

function bundle(opts, r) {
  [].concat(Object.keys(opts.on || {})).filter(Boolean).forEach(function(element) {
    r.on(element, opts.on[element])
  })

  opts.reduce = opts.reduce || {}
  opts.reduce.basedir = opts.basedir
  opts.reduce.factor = opts.factor

  return r.src(opts.entry, opts.reduce)
}

function getPipeline(opts, r) {
  var transforms = r.lazypipe()

  ;[].concat(opts.transforms).filter(Boolean).forEach(function(element) {
    transforms = transforms.pipe.apply(transforms, element)
  })

  return transforms.pipe.call(transforms, r.dest, opts.output.dir, opts.output.opts, opts.output.assets)
}

module.exports = Reduce
