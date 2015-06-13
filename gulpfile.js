var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('clean-scripts', function () {
  return gulp.src('dist/*.js', {read: false})
    .pipe(clean());
});
gulp.task('compress',['clean-scripts'], function() {
  return gulp.src('lib/*.js')
    .pipe(concat('workerio.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
