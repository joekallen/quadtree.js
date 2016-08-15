module.exports = function (grunt) {
  const glob = require('glob');

  const loadConfig = function loadConfig(gruntConfigPath) {
    const object = {};
    let length, key;

    let path = `${__dirname}/${gruntConfigPath}`;
    if (path.charAt(path.length - 1) !== '/') {
      path += '/';
    }

    glob.sync('*', {cwd: path}).forEach(function loadConfigFile(option) {
      length = option.length;
      key = option.replace(/\.js$/, '');
      object[key] = require(path + option);
    });

    return object;
  };

  const config = loadConfig('./grunt/config');
  config.pkg = grunt.file.readJSON('package.json');

  grunt.initConfig(config);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('remap-istanbul');

  grunt.registerTask('coverage', 'Runs the coverage report', ['karma:coverage', 'remapIstanbul:build'])
};

