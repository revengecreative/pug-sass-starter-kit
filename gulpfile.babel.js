import gulp from 'gulp'
import browserSync from 'browser-sync'
import prefix from 'gulp-autoprefixer'
import concat from 'gulp-concat'
import pug from 'gulp-pug'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'

const assets ='./src/assets';
const dist ='./dist';
const reload = browserSync.reload
const rootDir ='./';
const src ='./src';
const views ='./src/views';

gulp.task('serve', ['sass','templates'], () => {
    let files = ['**/*.{png,jpg,gif}'];
    browserSync.init(files, {
      server: { baseDir: dist },
      notify: false,
      port: 3019,
      browser: 'firefoxdeveloperedition' // pick your favourite browser
    });
    gulp.watch(`${src}/assets/sass/**/*.scss`, ['sass']);
    gulp.watch('**/*.html').on('change', reload);
    gulp.watch('**/*.php').on('change', reload);
    gulp.watch(`${views}/**/*.pug`,['pug-watch']);
});

gulp.task('sass', () => {
  return gulp.src(`${src}/assets/sass/**/*.scss`)
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle : 'compressed'}))
    .pipe(prefix('last 15 version', '> 1%', 'ie 8', 'ie 7'))
    .pipe(sourcemaps.write('maps', {addComment: true}))
    .pipe(plumber.stop())
    .pipe(gulp.dest(`${dist}/assets/css/`))
    .pipe(browserSync.stream());
});

gulp.task('templates', () => {
  return gulp.src(`${views}/**/!(_)*.pug`)
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('buildAssets', () => {
  return gulp.src([`${assets}/**`, `!${assets}/libraries{,/**}`, `!${assets}/sass{,/**}`])
    .pipe(gulp.dest(`${dist}/assets`))
})

gulp.task('pug-watch', ['templates'], reload);

gulp.task('default', ['serve']);
