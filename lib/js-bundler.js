var reduce = require('reduce-js')

module.exports = function (opts) {
  opts = opts || {}

  var pipeline = buildPipeline(opts)

  function bundler() {
    addEvents(reduce, opts.on)

    return reduce.src(opts.entries, opts.opts).pipe(pipeline())
  }

  function watch(cb) {
    var watcher = reduce.watch(opts.watch)
    addEvents(watcher, opts.on)

    watcher.on('close', cb)
    reduce.src(opts.entries, opts.opts).pipe(pipeline)
  }
}

function addEvents(host, listeners) {
  Object.keys(listeners || {}).forEach(function (evt) {
    host.on(evt, listeners[evt])
  })
}

function buildPipeline(opts) {
  var transforms = [].concat(opts.transforms).filter(Boolean)
  transforms.push([reduce.dest].concat(opts.dest || []))
  var build = reduce.lazypipe()
  transforms.forEach(function (tr) {
    build = build.apply(null, [].concat(tr))
  })
  return build
}

