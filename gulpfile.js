//  CSS
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const rename = require("gulp-rename");

gulp.task("css", function () {
  return gulp.src('./source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('style.css'))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});
gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "refresh"));
  gulp.watch("source/img/**/*.svg", gulp.series("copy", "images", "sprite", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});
//  Перезапуск сервера
gulp.task("refresh", function (done) {
  server.reload();
  done();
});
//  Копирование файлов
gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**/*.{png,jpg,svg}",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});
gulp.task("build", gulp.series(
  "copy",
  "css",
));
gulp.task("start", gulp.series("build", "server"));
