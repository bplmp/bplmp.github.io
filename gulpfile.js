var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cp = require('child_process');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var deploy = require("gulp-gh-pages");

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ['build'], {
      stdio: 'inherit'
    })
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', gulp.series('jekyll-build'), function() {
  browserSync.reload()
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function() {
  return gulp.src('_scss/main.scss')
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
  gulp.watch('_scss/*.scss', gulp.series('sass'));
  gulp.watch('_data/*', gulp.series('jekyll-rebuild'));
  gulp.watch('js/*', gulp.series('jekyll-rebuild'));
  gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], gulp.series('jekyll-rebuild'));
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', gulp.series('sass', 'jekyll-build'), function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task("deploy", gulp.series("sass", "jekyll-build"), function() {
  return gulp.src("./_site/**/*")
    .pipe(deploy({
      'branch': 'master'
    }));
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', gulp.series('watch'));
