var path = require('path')
var fs = require('fs')
var reducecss = require('reduce-css')
var reducejs = require('reduce-js')
var sequence = require('callback-sequence')
var mix = require('util-mix')

function reduce(config) {
  if (typeof config === 'object') {
    this.cfg = config
  } else {
    var cfgName = config || 'reduce.config.js'
    var cfgPath = path.join(process.cwd(), cfgName)
    this.cfg = fs.existsSync(cfgPath) && require(cfgPath)
  }

  if (!this.cfg) {
    this.cfg = {}
  }
  this.js = reducejs
  this.css = reducecss
}

reduce.prototype.run = function(cfg, cb) {
  var c = mix(this.cfg, cfg)
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

  return typeof cb === 'function' ? sequence.run(jobs, cb) : sequence.run(jobs)
}

reduce.prototype.watch = function(cfg) {
  var c = mix(this.cfg, cfg)
  if (c.css) {
    bundle(c.css, this.css.watch(c.css.watch || c.watch))
      .pipe(getPipeline(c.css, this.css))
  }
  if (c.js) {
    bundle(c.js, this.js.watch(c.js.watch || c.watch))
      .pipe(getPipeline(c.js, this.js))
  }
}

function bundle(opts, r) {
  for (var key in opts.on) {
    r.on(key, opts.on[key])
  }
  return r.src(opts.entry, opts.deps)
}

function getPipeline(opts, r) {
  var transforms = r.lazypipe()

  for (var key in opts.transforms) {
    transforms = transforms.pipe.apply(transforms, opts.transforms[key])
  }
  return transforms.pipe.apply(transforms, [r.dest].concat(opts.output))
}

module.exports = reduce
