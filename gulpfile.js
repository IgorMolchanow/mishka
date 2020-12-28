global.$ = {
  gulp: require('gulp'),
  del: require('del'),
  browserSync: require('browser-sync').create(),
  gp: require('gulp-load-plugins')(),
};

$.gulp.task('clean', function () {
  return $.del([
    'source/build'
  ]);
});

$.gulp.task('browser-sync', function(done) {
  $.browserSync.init({
    server: {
      baseDir: './source'
    },
    notify: false
  });

  $.browserSync.watch('source/').on('change', $.browserSync.reload);

  done()
});

$.gulp.task('compile-scss', () => {
  return $.gulp.src('./source/scss/*.scss')
    .pipe($.gp.sourcemaps.init())
    .pipe($.gp.sass({
      includePaths: ['./source/scss/**/*.scss'],
      outputStyle: 'expanded'
    }).on('error', $.gp.sass.logError))
    .pipe($.gp.sourcemaps.write())
    .pipe($.gp.autoprefixer({
      browsers: ['last 4 version']
    }))
    .pipe($.gulp.dest('./source/css/'))
    .pipe($.browserSync.reload({
      stream: true
    }));
});

$.gulp.task('html', function () {
  return $.gulp.src('source/*.html')
    .pipe($.gulp.dest('source/build/'))
});

$.gulp.task('js', function () {
  return $.gulp.src('source/js/*.js')
    .pipe($.gulp.dest('source/build/js/'))
});
$.gulp.task('css', function () {
  return $.gulp.src('source/css/*.css')
    .pipe($.gulp.dest('source/build/css/'))
});
$.gulp.task('fonts', function () {
  return $.gulp.src('source/fonts/*')
    .pipe($.gulp.dest('source/build/fonts/'))
});
$.gulp.task('img', function () {
  return $.gulp.src('source/img/*')
    .pipe($.gulp.dest('source/build/img/'))
});

$.gulp.task('watch', function () {
  $.gulp.watch('./source/scss/**/*.scss', $.gulp.series('compile-scss'));
});

$.gulp.task('default', $.gulp.series(
  'clean',
  'compile-scss',
  'html',
  'js',
  'css',
  'fonts',
  'img',

  $.gulp.parallel(
    'watch',
    'browser-sync'
  )
));




