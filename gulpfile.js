const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('inject', gulp.series(gulp.parallel('styles', 'scripts'), 'inject'));
gulp.task('build', gulp.series('partials', gulp.parallel('inject', 'other'), 'build'));
gulp.task('test', gulp.series('scripts', 'karma:single-run'));
gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));
gulp.task('serve', gulp.series('inject', 'partials', 'watch', 'browsersync', 'generate-service-worker'));
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist', 'generate-service-worker-dist'));
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
  gulp.watch([
    conf.path.src('index.html'),
    'bower.json'
  ], gulp.parallel('inject', 'partials'));

  gulp.watch(conf.path.src('app/**/*.html'), gulp.series('partials', 'browsersync'));
  gulp.watch([
    conf.path.src('**/*.scss'),
    conf.path.src('**/*.css')
  ], gulp.series('styles'));
  gulp.watch(conf.path.src('**/*.js'), gulp.series('inject'));
  done();
}

gulp.task('generate-service-worker', callback => {
  const path = require('path');
  const swPrecache = require('sw-precache');
  const rootDir = '.tmp';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif}', 'bower_components/**/*.{js,html,css,png,jpg,gif}'],
    stripPrefix: rootDir,
    verbose: true
  }, callback);
});

gulp.task('generate-service-worker-dist', callback => {
  const path = require('path');
  const swPrecache = require('sw-precache');
  const rootDir = 'dist';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif}'],
    stripPrefix: rootDir,
    verbose: true
  }, callback);
});
