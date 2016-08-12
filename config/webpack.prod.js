const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const helpers = require('./helpers');

const prodConfig = {
  output: {
    path: helpers.root('dist/js'),
    filename: '[name].min.js'
  },
  plugins:[
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};


module.exports = merge(common, prodConfig);