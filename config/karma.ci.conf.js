const webpackConfig = require('./webpack.test');

module.exports = function (config) {
  if( !process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY){
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7'
    },

    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 7',
      version: '30'
    },

    sl_ios_safari: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.9',
      version: '7.1'
    },

    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  config.set({

    customLaunchers: customLaunchers,
    sauceLabs: {
      testName: 'Quadtree Unit Tests',
      recordScreenshots: false,
      startConnect: true,
      build: process.env.TRAVIS_BUILD_NUMBER,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    /** Preprocessors */
    preprocessors: {
      './karma-test-shim.js': ['webpack', 'sourcemap']
    },

    // frameworks to use
    frameworks: [
      'chai',
      'jasmine-given',
      'jasmine'
    ],


    // list of files / patterns to load in the browser
    files: [
      {
        pattern: './karma-test-shim.js',
        watched: false
      }
    ],


    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'saucelabs'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: false
    },


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,

    plugins:[
      'karma-chai',
      'karma-jasmine-given',
      'karma-nested-reporter',
      'karma-jasmine-diff-reporter',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-sauce-launcher'
    ]
  })
};
