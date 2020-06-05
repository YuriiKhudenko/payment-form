const project_folder = 'build';
const source_folder = 'dev';

const path = {
  build: {
    html: project_folder+'/',
    css: project_folder+'/css/',
    img: project_folder+'/img/',
    js: project_folder+'/js/'
  },
  dev: {
    html: source_folder+'/pug/index.pug',
    css: source_folder+'/static/scss/main.scss',
    img: source_folder+'/static/img/**/*.{jpg,png,svg}',
    js: source_folder+'/static/js/main.js'
  },
  watch: {
    html: source_folder+'/pug/**/*.pug',
    css: source_folder+'/static/scss/**/*.scss',
    js: source_folder+'/static/js/**/*js',
    img: source_folder+'/static/img/**/*.{jpg,png,svg}'
  },
  clean: "./" + project_folder +'/'
};

const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  del = require('del'),
  scss = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder +'/'
    },
    port: 3000,
    notify: false
  })
}

const pugCompile = () => {
  return src(path.dev.html)
    .pipe(pug({pretty: true}))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
};

const scssCompile = () => {
  return src(path.dev.css)
    .pipe(sourcemaps.init())
    .pipe(scss())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(csso())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
};

const imgCompile = () => {
  return src(path.dev.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
};

const jsLibsCompile = () => {
  return src(['node_modules/jquery/dist/jquery.min.js',
    'node_modules/parsleyjs/dist/parsley.min.js'])
    .pipe(concat('libs.min.js'))
    .pipe(dest(path.build.js + '/libs'))
};

const jsCompile = () => {
  return src(path.dev.js)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};

const watchFiles = () => {
  gulp.watch([path.watch.html], pugCompile);
  gulp.watch([path.watch.css], scssCompile);
  gulp.watch([path.watch.js], jsCompile);
  gulp.watch([path.watch.img], imgCompile);
};

const clean = () => {
  return del(path.clean);
};

const build = gulp.series(clean, gulp.parallel(pugCompile, scssCompile,
  jsLibsCompile, jsCompile, imgCompile));
const watch = gulp.parallel(build, watchFiles, browserSync);


exports.imgCompile = imgCompile;
exports.jsCompile = jsCompile;
exports.pugCompile = pugCompile;
exports.scssCompile = scssCompile;
exports.build = build;
exports.watch = watch;
exports.default = watch;
