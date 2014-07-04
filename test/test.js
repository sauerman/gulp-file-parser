
require('mocha');

// add test here
var fs = require('fs');
var gulp = require('gulp');
var should = require('should');
var parser = require('gulp-file-parser');
var Promise = require('es6-promise').Promise;

describe('gulp-file-parser', function () {

    var filepath = __dirname + '/test'
    var file_content = 'hello, world';
    var file_extra = "!"

    before('init file', function () {
        fs.writeFileSync(filepath + '.txt', file_content, 'utf8');
    });

    it('should be able to parse string', function (done) {
        function parse (data) {
            return data + file_extra;
        }
        gulp.src(filepath + '.txt')
            .pipe(parser({
                name: 'test',
                extension: '.str',
                func: parse
            })())
            .pipe(gulp.dest(__dirname))
            .on('end', function () {
                fs.readFileSync(filepath + '.str', 'utf8')
                    .should.equal(file_content + file_extra);
                done();
            });
    });

    it('should be able to parse thunk', function (done) {
        function parse (data) {
            return function (cb) {
                cb(null, data + file_extra);
            };
        }
        gulp.src(filepath + '.txt')
            .pipe(parser({
                name: 'test',
                extension: '.thunk',
                func: parse
            })())
            .pipe(gulp.dest(__dirname))
            .on('end', function () {
                fs.readFileSync(filepath + '.thunk', 'utf8')
                    .should.equal(file_content + file_extra);
                done();
            });
    });

    it('shoule be able to parse promise', function (done) {
        function parse (data) {
            return new Promise(function (resolve, reject) {
                resolve(data + file_extra);
            });
        }
        gulp.src(filepath + '.txt')
            .pipe(parser({
                name: 'test',
                extension: '.promise',
                func: parse
            })())
            .pipe(gulp.dest(__dirname))
            .on('end', function () {
                fs.readFileSync(filepath + '.promise', 'utf8')
                    .should.equal(file_content + file_extra);
                done();
            });
    });

    it('should be able to handle extra arguments', function (done) {
        function parse (data, a_0, a_1, a_2) {
            a_0.should.equal(0);
            a_1.should.equal(1);
            a_2.should.equal(2);
            arguments.length.should.equal(4);
            return data + file_extra;
        }
        gulp.src(filepath + '.txt')
            .pipe(parser({
                name: 'test',
                extension: '.str',
                func: parse
            })(0, 1, 2))
            .pipe(gulp.dest(__dirname))
            .on('end', function () {
                fs.readFileSync(filepath + '.str', 'utf8')
                    .should.equal(file_content + file_extra);
                done();
            });
    });

    after('clear file', function () {
        // clear file
        fs.unlinkSync(filepath + '.txt');
        fs.unlinkSync(filepath + '.str');
        fs.unlinkSync(filepath + '.thunk');
        fs.unlinkSync(filepath + '.promise');
    });

});
