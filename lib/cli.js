var fs = require('fs')
var reduce = require('./main')
//var server = require('./server')

module.exports = function (args) {
  if (args._ && args._[0] === 'help' || args.help) {
    return fs.createReadStream(__dirname + '/usage.txt')
      .pipe(process.stdout)
      .on('close', function () { process.exit(1) })
  }

  if (args.version) {
    return console.log(require('../package.json').version)
  }

  var r = new reduce(args.config)

  if (!r.cfg.css && !r.cfg.js) {
    console.log("please check 'reduce.config.js' file.")
    return
  }

  args.css = r.cfg.css
  args.js = r.cfg.js

  if (args.watch) {
    r.watch()
  } else {
    r.run()
  }
}
