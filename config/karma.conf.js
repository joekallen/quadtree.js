const webpackConfig = require('./webpack.test');

module.exports = function (config) {
  config.set({

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

    browsers: ['Chrome'],
    reporters: ['jasmine-diff', 'nested'],

    nestedReporter: {
      color: {
        should: 'red',
        browser: 'yellow'
      },
      icon: {
        failure: '✘ ',
        indent: 'ட ',
        browser: ''
      }
    },
    jasmineDiffReporter: {
      color: {
        expectedBg: 'bgYellow', // default 'bgRed'
        expectedFg: 'black',    // default 'white'
        actualBg: 'bgRed',     // default 'bgGreen'
        actualFg: 'black',        // default 'white',
        defaultBg: 'white',     // default - none
        defaultFg: 'grey'       // default - none
      },
      pretty: true,       // 2 spaces by default for one indent level
      // pretty: '   '    // string - string to be used for one indent level
      // pretty: 4        // number - number of spaces for one indent level

      matchers: {
        toEqual: {
          pretty: false   // disable pretty print for toEqual
        },

        toHaveBeenCalledWith: {
          pretty: '  '   // use 2 spaces for one indent level
        }
      }
    },

    // web server port
    port: 9876,
    colors: true,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

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
      'karma-sourcemap-loader'
    ]
  });
};
