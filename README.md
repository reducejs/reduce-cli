# reduce-cli
CLI for [reduce-css](https://github.com/zoubin/reduce-css) and [reduce-js](https://github.com/zoubin/reduce-js).

# install

```
sudo npm install -g reduce-cli
```

# usage

```
Options:
        --watch, -w  Bundle and start watching for changes.
                     (with watch options in the config file)

       --config, -c  Specify the config file. The default config file is
                     reduce.config.js

         --help, -h  Show this message

      --version, -v  Show the current version
```

# example

* cd your_project
* wget https://github.com/zoubin/reduce-cli/raw/master/reduce.config.js
* edit reduce.config.js
* reduce-cli
    or
* reduce-cli --watch
    or 
* use it as a lib
```
var reduce = require('reduce')
var r = new reduce();

// bundle
r.run()

// bundle with a callback function
r.run({}, function(){
  console.log("done")
})

// bundle and watch
r.watch()

```
