module.exports = function () {
  var client = './src/client/';
  var clientApp = client + 'app/';
  var report = './report/';
  var root = './';
  var server = './src/server/';
  var temp = './.tmp/';
  var wiredep = require('wiredep');
  var bowerFiles = wiredep({ devDependencies: true })['js'];

  var config = {
    alljs: [
      './src/**/*.js',
      './*.js'
    ],
    build: './dist/stockview/',
    client: client,
    css: temp + 'styles.css',
    fonts: './bower_components/font-awesome/fonts/**/*.*',
    html: clientApp + '**/*.html',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ],
    less: client + 'styles/styles.less',
    report: report,
    root: root,
    server: server,
    temp: temp,

    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },

    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app.core',
        standAlone: false,
        root: 'app/'
      }
    },

    browserReloadDelay: 1000,

    bower: {
      json: require('./bower.json'),
      directory: './bower_components/',
      ignorePath: '../..'
    },
    packages: [
      './package.json',
      './bower.json'
    ],

    defaultPort: 4000,
    nodeServer: './src/server/app.js'

  };

  config.getWiredepDefaultOptions = function () {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  return config;
};
