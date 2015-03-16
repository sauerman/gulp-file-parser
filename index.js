'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

function isPromise (obj) {
    return obj.then && (typeof obj.then === 'function');
}

function isThunk (obj) {
    return typeof obj === 'function';
}

module.exports = function (options) {
    options = options || {};

    var PLUGIN_NAME = options.name || "no name";
    var EXTENSION = options.extension;

    var parseFunc = options.function || options.func || (function (x) { return x; });

    return function () {
    	// options to parse function
    	var opts = Array.prototype.slice.call(arguments, 0);

	    return through.obj(function (file, enc, callback) {

	        if (file.isNull()) {
	            this.push(file);
	            return callback();
	        }

	        if (file.isStream()) {
	            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
	            return callback();
	        }

	        if (file.isBuffer()) {
	            try {
	            	var args = [file.contents.toString(), file.path];
	            	opts.forEach(function (opt) { args.push(opt); });

                    var result = parseFunc.apply(null, args);

                    if (isPromise(result)) {
                        return result.then(resolve, reject);
                    }

                    if (isThunk(result)) {
                        return result(function (err, data) {
                            err ? reject(err) : resolve(data);
                        });
                    }

                    // return string data
                    resolve(result)

	            } catch (error) {
                    reject(new PluginError(PLUGIN_NAME, error));
	            }
	        }

            function resolve (data) {
                file.contents = new Buffer(data);
                if (EXTENSION) {
                    file.path = gutil.replaceExtension(file.path, EXTENSION);
                }
                callback(null, file);
            }

            function reject (err) {
                callback(err);
            }
	    });
	};
}
