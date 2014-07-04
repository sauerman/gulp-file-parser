'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

module.exports = function (parseFunc, options) {
    options = options || {};

    const PLUGIN_NAME = options.name || "no name";
    const EXTENSION = options.extension;

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
	            	var args = [file.contents.toString()];
	            	opts.forEach(function (opt) { args.push(opt); });
	                file.contents = new Buffer(parseFunc.apply(null, args));
	                if (EXTENSION) {
	                	file.path = gutil.replaceExtension(file.path, EXTENSION);
	                }
	                this.push(file);
	            } catch (error) {
	                this.emit('error', new PluginError(PLUGIN_NAME, error));
	            }
	            return callback();
	        }
	    });
	};
}

// usage:
//module.exports = require('gulp-file-parser')(, { name: "gulp-jeml", extension: ".js" })
