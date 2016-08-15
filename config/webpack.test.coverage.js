var helpers = require('./helpers');
var path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    fallback: path.join(__dirname, '..', 'node_modules'),
    extensions: ['', '.ts']
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loaders: ['coffee-loader']
      }, {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          sourceMap: false,
          inlineSourceMap: true
        }
      }
    ],
    postLoaders: [
    /**
     * Instruments TS source files for subsequent code coverage.
     * See https://github.com/deepsweet/istanbul-instrumenter-loader
     */
      {
        test: /\.ts$/,
        loader: 'istanbul-instrumenter-loader',
        exclude: [
          'node_modules',
          /\.(e2e|spec)\.ts$/
        ]
      }
    ]
  },
  ts: {
    configFileName: helpers.root('config/tsconfig.json')
  }
};