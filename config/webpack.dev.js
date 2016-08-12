const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const helpers = require('./helpers');

const devConfig = {
  output: {
    path: helpers.root('dist/js'),
    filename: '[name].js'
  }
};


module.exports = merge(common, devConfig);