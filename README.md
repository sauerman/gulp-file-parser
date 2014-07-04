# gulp-file-parser

simple way to parse file with gulp

## Installation

```
$ npm install gulp-file-parser
```

## Example

```js
var parser = require('gulp-file-parser');

var gulp_jeml = parser({
    name: 'gulp-jeml',
    func: require('jeml').parse,
    extension: '.js'
});

var logger = parser({
    name: 'gulp-logger',
    func: function (data) {
        console.log(data);
        return data;
    }
});

gulp.src(some_path)
    .pipe(gulp_jeml())
    .pipe(logger())
    .pipe(gulp.dest(some_dir))
```

# License

  MIT
