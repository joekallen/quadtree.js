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
        loaders: ['ts']
      },
      {
        test: /\.html$/,
        loader: "html"
      }
    ]
  },
  ts: {
    configFileName: helpers.root('config/tsconfig.json')
  }
};