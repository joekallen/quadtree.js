var path = require('path');
var webpackConfig = require('./webpack.test.coverage');

module.exports = function (config) {
  var webdriverConfig = {
    protocol: 'http:',
    hostname: '10.40.184.88',
    port: 4444,
    path: '/wd/hub'
  };
  config.set({
    basePath: './',
    /**
     * Preprocessors
     */
    preprocessors: {
      './karma-test-shim.js': ['webpack']
    },
    /**
     * Frameworks
     */
    frameworks: [
      'chai',
      'jasmine-given',
      'jasmine',
      'source-map-support'
    ],

    /**
     * Files
     */
    files: [
      {
        pattern: './karma-test-shim.js',
        watched: false
      }
    ],


    browsers: ['Chrome'],
    coverageReporter: {
      reporters: [
        {
          type: 'json',
          subdir: '../../coverage',
          file: 'coverage.json'
        }
      ]
    },
    reporters: ['jasmine-diff', 'nested', 'coverage'],
    junitReporter: {
      outputDir: './build'
    },
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
    port: 9876,
    colors: true,
    singleRun: true,

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    webpackServer: {
      noInfo: false
    },
    logLevel: config.LOG_ERROR,
    concurrency: Infinity,
    plugins: [
      'karma-coverage',
      'karma-chai',
      'karma-jasmine-given',
      'karma-nested-reporter',
      'karma-jasmine-diff-reporter',
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-webpack',
      'karma-source-map-support'
    ]
  });
};
