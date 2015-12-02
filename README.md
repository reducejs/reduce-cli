# reduce-cli
CLI for [reduce-css](https://github.com/zoubin/reduce-css) and [reduce-js](https://github.com/zoubin/reduce-js).

# install

```
npm install reduce-cli
cd node_modules/reduce-cli
sudo npm link
```
or

```
npm install -g reduce-cli
```

# usage

```
reduce -h
```

# example

See the examples in the `example` directory.

Run `reduce` in the example directory to check the output files.

```
cd example/base
reduce
ls -lR build
```

# use it as a lib
```
var reduce = require('reduce-cli')

// bundle
reduce()

// bundle with a callback function
reduce().then(callback).catch(handle_error)

// bundle and watch
reduce.watch()

```
