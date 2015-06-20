var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('clean-scripts', function () {
  return gulp.src('dist/*.js', {read: false})
    .pipe(clean());
});
gulp.task('compressMin', function() {
  return gulp.src('lib/*.js')
    .pipe(concat('workerio.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
gulp.task('compressFull', function() {
  return gulp.src('lib/*.js')
    .pipe(concat('workerio.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist'));
});
gulp.task('compile',['clean-scripts','compressFull','compressMin'], function() {
//   return gulp.src('lib/*.js')
//     .pipe(concat('workerio.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist'));
 }
);
