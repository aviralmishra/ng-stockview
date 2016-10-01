var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var path = require('path');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({ lazy: true });
var port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('jscode', function () {
  log('Running JSHint and JSCS');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function () {
  log('Running Less to CSS');

  return gulp
    .src(config.less)
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
    .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function () {
  log('Copying fonts');

  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function () {
  log('Compressing and copying images');

  return gulp
    .src(config.images)
    .pipe($.imagemin({ optimizationLevel: 4 }))
    .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean', function (done) {
  var delconfig = [].concat(config.build, config.temp);
  log('Cleaning directory ' + $.util.colors.blue(delconfig));

  del(delconfig, done);
});

gulp.task('clean-fonts', function (done) {
  log('Cleaning fonts');
  clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function (done) {
  log('Cleaning images');
  clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-styles', function (done) {
  log('Cleaning styles');
  clean(config.temp + '**/*.css', done);
});

gulp.task('clean-code', function (done) {
  log('Cleaning code');

  var files = [].concat(
    config.temp + '**/*.js',
    config.build + '**/*.html',
    config.build + 'js/**/*.js'
  );
  clean(files, done);
});

gulp.task('less-watcher', function () {
  gulp.watch([config.less], ['styles']);
});

gulp.task('templatecache', ['clean-code'], function () {
  log('Creating AngularJS $templateCache');

  return gulp
    .src(config.htmltemplates)
    .pipe($.minifyHtml({ empty: true }))
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', function () {
  log('Wire up the Bower CSS, JS and application code into the HTML');
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.js)))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function () {
  log('Wire up the application CSS into the HTML');

  return gulp
    .src(config.index)
    .pipe($.inject(gulp.src(config.css)))
    .pipe(gulp.dest(config.client));
});

gulp.task('build', ['optimize', 'images', 'fonts'], function () {
  log('Building the application');

  var msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the build folder',
    message: 'Running `gulp serve-build`'
  };
  del(config.temp);
  log(msg);
  notify(msg);
});

gulp.task('optimize', ['inject'], function () {
  log('Optimizing application resources');

  var assets = $.useref.assets({ searchPath: './' });
  var templateCache = config.temp + config.templateCache.file;
  var cssFilter = $.filter('**/*.css');
  var jsLibFilter = $.filter('**/' + config.optimized.lib);
  var jsAppFilter = $.filter('**/' + config.optimized.app);

  return gulp
    .src(config.index)
    .pipe($.plumber())
    .pipe($.inject(
      gulp.src(templateCache, { read: false }), {
        starttag: '<!-- inject:templates:js -->'
      }))
    .pipe(assets)
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(jsLibFilter)
    .pipe($.uglify())
    .pipe(jsLibFilter.restore())
    .pipe(jsAppFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsAppFilter.restore())
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest(config.build))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.build));
});

/**
 * Update the version
 * --type=pre will update the prerelease version *.*.*-x
 * --type=patch or no flag will update the patch version *.*.x
 * --type=minor will update the minor version *.x.*
 * --type=major will update the major version x.*.*
 * --version=1.2.3 will update to a specific version and ignore other flags
 */
gulp.task('update', function () {
  var msg = 'Updating version';
  var type = args.type;
  var version = args.version;
  var options = {};
  if (version) {
    options.version = version;
    msg += ' to ' + version;
  } else {
    options.type = type;
    msg += ' for a ' + type;
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root));
});

gulp.task('serve-build', ['build'], function () {
  serve(false /* isDev */);
});

gulp.task('serve-dev', ['inject'], function () {
  serve(true /* isDev */);
});

function serve(isDev, specRunner) {
  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };

  return $.nodemon(nodeOptions)
    .on('restart', function (ev) {
      log('*** nodemon restarted');
      log('files changed on restart:\n' + ev);
      setTimeout(function () {
        browserSync.notify('reloading now ...');
        browserSync.reload({ stream: false });
      }, config.browserReloadDelay);
    })
    .on('start', function () {
      log('*** nodemon started');
      startBrowserSync(isDev, specRunner);
    })
    .on('crash', function () {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function () {
      log('*** nodemon exited cleanly');
    });
}

function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function notify(options) {
  var notifier = require('node-notifier');
  var notifyOptions = {
    sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png')
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

function startBrowserSync(isDev, specRunner) {
  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting browser-sync on port ' + port);

  if (isDev) {
    gulp.watch([config.less], ['styles'])
      .on('change', changeEvent);
  } else {
    gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload])
      .on('change', changeEvent);
  }

  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: isDev ? [
      config.client + '**/*.*',
      '!' + config.less,
      config.temp + '**/*.css'
    ] : [],
    ghostMode: {
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: '[stockview]',
    notify: true,
    reloadDelay: 0
  };

  if (specRunner) {
    options.startPath = config.specRunnerFile;
  }

  browserSync(options);
}

function clean(path, done) {
  log('Cleaning: ' + $.util.colors.magenta(path));
  del(path, done);
}

function log(msg) {
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.magenta(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.magenta(msg));
  }
}
