var path = require('path')
var multimatch = require('multimatch')
var thr = require('through2')

// `opts` is options for `reduce-js` or `reduce-css`
module.exports = function (opts, extra) {
  var hasCommon = !!opts.factor.common || !opts.factor.needFactor
  var commonFilters = []

  var bootstrap = extra.bootstrap
  if (bootstrap) {
    bootstrap = [].concat(bootstrap).map(function (file) {
      return path.resolve(opts.basedir || '.', file)
    })

    if (hasCommon) {
      commonFilters.push(function (row) {
        return bootstrap.indexOf(row.file) >= 0
      })
    } else {
      // Should go to every bundle.
      // We force entries to depend upon bootstrap entries,
      // so suppress the warnings.
      opts.factor.silent = true
    }

    var listeners = extra.on
    listeners.instance = [].concat(listeners.instance).filter(Boolean)
    listeners.instance.push(function (b) {
      // Do not add bootstrap into `entries` of the options object,
      // cause that would create new bundles.
      // And we want them to be packed into the common bundle.
      b.add(bootstrap)

      if (!hasCommon) {
        b.plugin(addDeps, { files: bootstrap })
      }

    })
  }

  var commonModules = extra.commonModules
  if (hasCommon && commonModules) {
    commonFilters.push(function (row) {
      return multimatch(row.file, commonModules).length
    })
  }

  opts.factor.threshold = function (row, groups) {
    var isCommon = commonFilters.some(function (fn) {
      return fn(row)
    })
    if (isCommon) {
      return true
    }
    if (typeof row.common === 'boolean') {
      return row.common
    }
    return groups.length > (extra.threshold || 1) || groups.length === 0
  }
}

function addDeps(b, opts) {
  var bootstrap = opts.files
  b.on('reset', add)
  add()

  function add() {
    var entries

    b.pipeline.get('record').push(thr.obj(function (row, _, next) {
      next(null, row)
    }, function (done) {
      entries = b._recorded.map(function (row) {
        return row.file
      }).filter(Boolean)
      done()
    }))

    b.pipeline.get('sort').unshift(thr.obj(function (row, _, next) {
      var isEntry = row.entry || entries.indexOf(row.file) > -1
      if (isEntry && bootstrap.indexOf(row.file) === -1) {
        bootstrap.forEach(function (dep) {
          row.deps[path.relative(b._options.basedir, dep)] = dep
        })
      }
      next(null, row)
    }))

  }
}
