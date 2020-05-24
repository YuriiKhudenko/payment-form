const gulp = require('gulp');

// ======= PUG ========
const pug = require('gulp-pug');

// ======= SCSS ========
const scss = require('gulp-sass');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

// ======= JS ========
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// ======= SERVER ========
const server = require('browser-sync').create();

// ======= SVG ========
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');

// ======= IMG ========
const tinypng = require('gulp-tinypng');


// ======= SERVER ========

gulp.task('browser-sync', function () {
  server.init({
    server: {
      baseDir: './build'
    }
  });
  gulp.watch('dev/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('dev/static/scss/**/*.scss', gulp.series('scss'));
  gulp.watch('dev/static/js/**/*.js', gulp.series('script'));
  gulp.watch('dev/static/img/**/*.svg', gulp.series('svg'));
  gulp.watch('dev/static/img/**/*.{png,jpg,gif}', gulp.series('img'));
  gulp.watch('dev/static/fonts/**/*.*', gulp.series('font'));
  server.watch('build', server.reload)
});

// ======= PUG ========

gulp.task('pug', function () {
  return gulp.src('dev/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});


// ======= SCSS ========

gulp.task('scss', function () {
  return gulp.src('dev/static/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(csso())
    .pipe(autoprefixer({
      overrideBrowserslist:  [ "last 4 version" ],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css/'))
});


// ======= JS ========

gulp.task('script', function () {
  return gulp.src('dev/static/js/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'))
});


// ======= SVG ========

gulp.task('svg', function () {
  return gulp.src('dev/static/img/svg/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "sprite.svg"
        }
      }
    }))
    .pipe(gulp.dest('build/img/svg/'))
});


// ======= IMG ========

gulp.task('img', function () {
  return gulp.src('dev/static/img/*.{png,jpg,gif}')
    .pipe(tinypng('2gWX1CCp0Rj3n1TQfFdBPVB6yscf5b58'))
    .pipe(gulp.dest('build/img/'))
});


// ======= Font ========

gulp.task('font', function () {
  return gulp.src('dev/static/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts/'))
});


gulp.task('watch', function () {
  gulp.watch('dev/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('dev/static/scss/**/*.scss', gulp.series('scss'))
});

gulp.task('default', gulp.series(
  gulp.parallel('pug', 'scss', 'script', 'svg', 'img', 'font'),
  gulp.parallel('watch', 'browser-sync')
));