module.exports = function (grunt) {
  var glob = require('glob'),
    config;

  var loadConfig = function loadConfig(path) {
    var object = {},
      length,
      key;

    var path = __dirname + '/' + path;
    if (path.charAt(path.length - 1) !== '/') {
      path += '/';
    }

    glob.sync('*', {cwd: path}).forEach(function loadConfigFile(option) {
      length = option.length;

      if (length > 5 && option.substring(length - 5) == '.frag') {
        return;
      }
      key = option.replace(/\.js$/, '');
      object[key] = require(path + option);
    });

    return object;
  };

  config = loadConfig('./grunt/config');
  config.pkg = grunt.file.readJSON('package.json')

  grunt.initConfig(config);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};