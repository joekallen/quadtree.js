const helpers = require('./helpers');
const path = require('path');
module.exports = {
  entry: {
    'Quadtree': helpers.root('src/ts/Quadtree.ts')
  },
  devtool: 'source-map',
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    fallback: path.join(__dirname, '..', 'node_modules'),
    extensions: ['', '.ts', '.html', '.js']
  },
  output: {
    library: ['Quadtree'],
    libraryTarget: 'umd'
  },
  //tslint: require('./tslint'),
  module: {
    //preLoaders: [
    //  {
    //    test: /\.ts$/,
    //    loader: 'tslint'
    //  }
    //],
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts'
      }
    ]
  },
  ts: {
    configFileName: helpers.root('config/tsconfig.json')
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },
  progress: true,
  watch: true,
  keepalive: true,
  failOnError: false
};