
module.exports = function (reduce, opts, watchOpts) {
  function bundler() {
    var pipeline = buildPipeline(reduce, opts)
    addEvents(reduce, opts.on)

    return reduce.run(function () {
      return reduce.src(opts.entries, opts.reduce).pipe(pipeline())
    })
  }

  function watch(cb) {
    var pipeline = buildPipeline(reduce, opts)
    var watcher = reduce.watch(watchOpts)
    addEvents(watcher, opts.on)

    cb = typeof cb === 'function' ? cb : function () {}
    watcher.on('close', cb)
    watcher.src(opts.entries, opts.reduce).pipe(pipeline)
  }

  bundler.watch = watch

  return bundler
}

function addEvents(host, listeners) {
  Object.keys(listeners || {}).forEach(function (evt) {
    [].concat(listeners[evt]).forEach(function (cb) {
      if (typeof cb === 'function') {
        host.on(evt, cb)
      }
    })
  })
}

function buildPipeline(reduce, opts) {
  var transforms = [].concat(opts.transforms).filter(Boolean)
  transforms.push([reduce.dest].concat(opts.dest || []))
  var build = reduce.lazypipe()
  transforms.forEach(function (tr) {
    build = build.pipe.apply(null, [].concat(tr))
  })
  return build
}

